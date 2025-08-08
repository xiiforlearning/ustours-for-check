import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto, BookingStatus } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ToursService } from '../tours/tours.service';
import { TourType } from '../tours/dto/create-tour.dto';
import { UsersService } from '../users/users.service';
import { SchedulerService } from '../scheduler/scheduler.service';
import { User } from '../users/entities/user.entity';
import { Payment, PaymentStatus, Currency, PaymentMethod } from '../payments/entities/payment.entity';
import { OctoService } from '../payments/services/octo.service';
import { TelegramService } from '../telegram/telegram.service';
import * as moment from 'moment-timezone';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly toursService: ToursService,
    private readonly usersService: UsersService,
    private readonly schedulerService: SchedulerService,
    private readonly octoService: OctoService,
    private readonly telegramService: TelegramService,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: string): Promise<{ booking: Booking; payment: Payment | null; paymentUrl: string | null }> {
    const tour = await this.toursService.findOne(createBookingDto.tourId);
    if (!tour) {
      throw new NotFoundException('Тур не найден');
    }

    if (tour.status !== 'active') {
      throw new BadRequestException('Тур недоступен для бронирования');
    }

    // Find customer by user ID
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      relations: ['customer']
    });
    if (!user || !user.customer) {
      throw new BadRequestException('Customer profile not found for this user');
    }

    // Гарантируем, что дата — строка
    const tourDateStr = typeof createBookingDto.tourDate === 'string'
      ? createBookingDto.tourDate
      : createBookingDto.tourDate instanceof Date
        ? createBookingDto.tourDate.toISOString().split('T')[0]
        : String(createBookingDto.tourDate);

    // Check availability - this will throw specific error messages if validation fails
    await this.checkAvailability(createBookingDto.tourId, tourDateStr, createBookingDto.adultsCount + (createBookingDto.childrenCount || 0));

    const totalPeople = createBookingDto.adultsCount + (createBookingDto.childrenCount || 0);
    
    // Определяем цену в зависимости от типа бронирования
    const isGroupBooking = createBookingDto.isGroup || false;
    let totalPrice: number;
    
    // Логика расчета цены:
    // 1. PRIVATE туры - всегда используют group_price (если есть), иначе price per person
    // 2. GROUP туры с isGroup=true - используют group_price (фиксированная цена за "выкуп" всего тура)
    // 3. GROUP туры с isGroup=false - используют price per person
    const shouldUseGroupPrice = (tour.type === TourType.PRIVATE || isGroupBooking) && 
                               tour.group_price !== null && tour.group_price !== undefined;
    
    if (shouldUseGroupPrice) {
      // Фиксированная цена за весь тур/день
      totalPrice = tour.group_price || 0;
    } else {
      // Расчет per person
      const adultPrice = tour.price || 0;
      const childPrice = tour.child_price || 0;
      totalPrice = (createBookingDto.adultsCount * adultPrice) + ((createBookingDto.childrenCount || 0) * childPrice);
    }
    
    // Для записи в БД определяем adult_price (для совместимости)
    const adultPriceForDB = shouldUseGroupPrice
      ? (tour.group_price || 0) // При групповом бронировании записываем group_price с fallback
      : (tour.price || 0);

    // Преобразуем дату из формата DD.MM.YYYY в YYYY-MM-DD, если нужно
    let normalizedTourDate = tourDateStr;
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(tourDateStr)) {
      const [day, month, year] = tourDateStr.split('.');
      normalizedTourDate = `${year}-${month}-${day}`;
    }

    const booking = this.bookingRepository.create({
      customer_id: user.customer.id,
      tour_id: createBookingDto.tourId,
      tour_date: normalizedTourDate, // всегда ISO-строка
      adults_count: createBookingDto.adultsCount,
      children_count: createBookingDto.childrenCount || 0,
      isGroup: createBookingDto.isGroup || false,
      total_price: totalPrice,
      adult_price: adultPriceForDB,
      child_price: tour.child_price || 0,
      special_requirements: createBookingDto.specialRequirements,
      contact_fullname: createBookingDto.contactFullname,
      whatsapp: createBookingDto.whatsapp,
      telegram: createBookingDto.telegram,
      contact_phone: createBookingDto.contactPhone,
      contact_email: createBookingDto.contactEmail,
      status: BookingStatus.CONFIRMED, // сразу подтверждаем
      confirmed_at: new Date(), // ставим дату подтверждения
      currency_code: (createBookingDto.currencyCode && typeof createBookingDto.currencyCode === 'string')
        ? createBookingDto.currencyCode
        : (tour.currency || 'UZS'),
      currency_rate: (typeof createBookingDto.currencyRate === 'number')
        ? createBookingDto.currencyRate
        : 1,
    });

    const savedBooking = await this.bookingRepository.save(booking);

    await this.updateTourAvailability(createBookingDto.tourId, tourDateStr, totalPeople, tour.partner_id, createBookingDto.isGroup || false);

    // --- Отключаем создание платежа и генерацию paymentUrl ---
    /*
    // Create payment record with OCTO integration
    const payment = this.paymentRepository.create({
      amount: totalPrice,
      currency: Currency.UZS,
      status: PaymentStatus.PENDING,
      paymentMethod: PaymentMethod.BANK_CARD,
      shopTransactionId: this.octoService.generateShopTransactionId(savedBooking.id),
      description: `Оплата бронирования тура: ${tour.title}`,
      userData: {
        userId: user.id,
        phone: createBookingDto.contactPhone || '',
        email: user.email || createBookingDto.contactEmail || '',
      },
      basket: [{
        positionDesc: tour.title,
        count: totalPeople,
        price: totalPrice / totalPeople,
        spic: `Взрослых: ${createBookingDto.adultsCount}, Детей: ${createBookingDto.childrenCount || 0}`,
      }],
      returnUrl: process.env.PAYMENT_RETURN_URL || 'https://your-frontend.com/payment/success',
      notifyUrl: process.env.PAYMENT_NOTIFY_URL || 'https://your-backend.com/payments/notify',
      language: 'ru',
      ttl: 15,
      test: true,
      autoCapture: true,
      initTime: new Date(),
      user_id: userId,
      booking_id: savedBooking.id,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // Generate OCTO payment URL
    let paymentUrl = '';
    try {
      const octoResponse = await this.octoService.preparePayment(savedPayment, {
        bookingId: savedBooking.id,
        paymentMethod: PaymentMethod.BANK_CARD,
        test: true,
        language: 'ru',
        ttl: 15,
        returnUrl: process.env.PAYMENT_RETURN_URL || 'https://your-frontend.com/payment/success',
        notifyUrl: process.env.PAYMENT_NOTIFY_URL || 'https://your-backend.com/payments/notify',
      });

      console.log('OCTO Response:', JSON.stringify(octoResponse, null, 2));

      // Handle different response structures
      const transactionId = octoResponse.data?.transaction_id || (octoResponse.data as any)?.octo_payment_UUID || (octoResponse as any).octo_payment_UUID;
      const paymentUrlFromResponse = octoResponse.data?.payment_url || (octoResponse.data as any)?.octo_pay_url || (octoResponse as any).octo_pay_url;

      if (paymentUrlFromResponse) {
        paymentUrl = paymentUrlFromResponse;
        
        // Update payment with OCTO transaction ID
        await this.paymentRepository.update(savedPayment.id, {
          octoTransactionId: transactionId,
          status: PaymentStatus.PROCESSING,
        });
      } else {
        throw new BadRequestException('Не удалось получить URL для оплаты от OCTO');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('OCTO payment preparation failed:', error.message);
      } else {
        console.error('OCTO payment preparation failed:', String(error));
      }
      // Continue without payment URL - booking is still valid
      paymentUrl = '';
    }
    */
    // --- Конец отключения оплаты ---

    // Таймер автоматической отмены бронирования отключён:
    // try {
    //   await this.schedulerService.scheduleBookingExpiration(savedBooking.id);
    // } catch (error) {
    //   if (error instanceof Error) {
    //     console.warn('Failed to schedule booking expiration:', error.message);
    //   } else {
    //     console.warn('Failed to schedule booking expiration:', String(error));
    //   }
    //   // Continue without scheduling - booking is still valid
    // }

    // Отправляем уведомление в Telegram
    try {
      // Получаем полное бронирование с tour для отправки в Telegram
      const bookingWithTour = await this.bookingRepository.findOne({
        where: { id: savedBooking.id },
        relations: ['tour']
      });
      
      if (bookingWithTour) {
        await this.telegramService.sendBookingNotification(bookingWithTour);
      }
    } catch (error) {
      // Логируем ошибку, но не прерываем создание бронирования
      console.warn('Failed to send Telegram notification:', error);
    }

    return { 
      booking: savedBooking, 
      payment: null, 
      paymentUrl: null 
    };
  }

  async findAll(userId?: string, partnerId?: string): Promise<Booking[]> {
    console.log('BookingsService.findAll called with userId:', userId, 'partnerId:', partnerId);
    
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.customer', 'customer')
      .leftJoinAndSelect('customer.user', 'user')
      .leftJoinAndSelect('booking.tour', 'tour')
      .leftJoinAndSelect('tour.partner', 'partner');

    if (userId) {
      console.log('Adding userId filter:', userId);
      queryBuilder.andWhere('user.id = :userId', { userId });
    }

    if (partnerId) {
      console.log('Adding partnerId filter:', partnerId);
      queryBuilder.andWhere('tour.partner_id = :partnerId', { partnerId });
    }

    const result = await queryBuilder.orderBy('booking.created_at', 'DESC').getMany();
    console.log('Found bookings count:', result.length);
    
    return result;
  }

  async findOne(id: string, userId?: string, partnerId?: string): Promise<Booking> {
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.customer', 'customer')
      .leftJoinAndSelect('customer.user', 'user')
      .leftJoinAndSelect('booking.tour', 'tour')
      .leftJoinAndSelect('tour.partner', 'partner')
      .where('booking.id = :id', { id });

    if (userId) {
      queryBuilder.andWhere('user.id = :userId', { userId });
    }

    if (partnerId) {
      queryBuilder.andWhere('tour.partner_id = :partnerId', { partnerId });
    }

    const booking = await queryBuilder.getOne();
    if (!booking) {
      throw new NotFoundException('Бронирование не найдено');
    }

    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto, partnerId?: string): Promise<Booking> {
    const booking = await this.findOne(id, undefined, partnerId);

    if (partnerId && booking.tour.partner_id !== partnerId) {
      throw new ForbiddenException('Нет прав на обновление этого бронирования');
    }

    const updateData: any = {
      status: updateBookingDto.status,
    };

    switch (updateBookingDto.status) {
      case BookingStatus.CONFIRMED:
        updateData.confirmed_at = new Date();
        try {
          await this.schedulerService.cancelBookingExpiration(id);
        } catch (error) {
          if (error instanceof Error) {
            console.warn('Failed to cancel booking expiration:', error.message);
          } else {
            console.warn('Failed to cancel booking expiration:', String(error));
          }
        }
        break;
      case BookingStatus.CANCELLED:
        updateData.cancelled_at = new Date();
        updateData.cancellation_reason = updateBookingDto.comment;
        try {
          await this.schedulerService.cancelBookingExpiration(id);
        } catch (error) {
          if (error instanceof Error) {
            console.warn('Failed to cancel booking expiration:', error.message);
          } else {
            console.warn('Failed to cancel booking expiration:', String(error));
          }
        }
        await this.returnTourAvailability(booking.tour_id, booking.tour_date, booking.adults_count + booking.children_count, booking.tour.partner_id);
        break;
      case BookingStatus.COMPLETED:
        updateData.completed_at = new Date();
        try {
          await this.schedulerService.cancelBookingExpiration(id);
        } catch (error) {
          if (error instanceof Error) {
            console.warn('Failed to cancel booking expiration:', error.message);
          } else {
            console.warn('Failed to cancel booking expiration:', String(error));
          }
        }
        break;
    }

    await this.bookingRepository.update(id, updateData);
    return this.findOne(id, undefined, partnerId);
  }

  async cancel(id: string, userId: string, reason?: string): Promise<Booking> {
    const booking = await this.findOne(id, userId);
    
    if (booking.status !== BookingStatus.PENDING && booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Бронирование нельзя отменить');
    }

    const updateData: any = {
      status: BookingStatus.CANCELLED,
      cancelled_at: new Date(),
      cancellation_reason: reason,
    };

    await this.bookingRepository.update(id, updateData);

    try {
      await this.schedulerService.cancelBookingExpiration(id);
    } catch (error) {
      if (error instanceof Error) {
        console.warn('Failed to cancel booking expiration:', error.message);
      } else {
        console.warn('Failed to cancel booking expiration:', String(error));
      }
    }

    await this.returnTourAvailability(booking.tour_id, booking.tour_date, booking.adults_count + booking.children_count, booking.tour.partner_id);

    return this.findOne(id, userId);
  }

  
  async autoCancel(id: string, reason: string): Promise<Booking> {
    const booking = await this.findOne(id);
    
    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Бронирование нельзя отменить автоматически');
    }

    const updateData: any = {
      status: BookingStatus.CANCELLED,
      cancelled_at: new Date(),
      cancellation_reason: reason,
    };

    await this.bookingRepository.update(id, updateData);

    await this.returnTourAvailability(booking.tour_id, booking.tour_date, booking.adults_count + booking.children_count, booking.tour.partner_id);

    return this.findOne(id);
  }

  private async checkAvailability(tourId: string, date: string, peopleCount: number): Promise<void> {
    const tour = await this.toursService.findOne(tourId);
    if (!tour) {
      throw new BadRequestException(`Тур с ID ${tourId} не найден`);
    }
    
    if (!tour.availability || tour.availability.length === 0) {
      throw new BadRequestException(`Тур "${tour.title}" не имеет данных о доступности. Обратитесь к организатору тура.`);
    }

    // Нормализуем дату бронирования к ISO формату
    let normalizedDate = date;
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(date)) {
      const [day, month, year] = date.split('.');
      normalizedDate = `${year}-${month}-${day}`;
    }

    // Ищем availability item с учетом нормализации дат
    const availabilityItem = tour.availability.find(item => {
      let itemNormalizedDate = item.date;
      if (/^\d{2}\.\d{2}\.\d{4}$/.test(item.date)) {
        const [day, month, year] = item.date.split('.');
        itemNormalizedDate = `${year}-${month}-${day}`;
      }
      return itemNormalizedDate === normalizedDate;
    });

    if (!availabilityItem) {
      const availableDates = tour.availability.map(item => item.date).join(', ');
      throw new BadRequestException(`Дата ${date} недоступна для тура "${tour.title}". Доступные даты: ${availableDates || 'нет данных'}`);
    }

    if (availabilityItem.available_slots < peopleCount) {
      throw new BadRequestException(`Недостаточно мест на ${date}. Доступно: ${availabilityItem.available_slots}, запрошено: ${peopleCount}`);
    }
  }

  private async updateTourAvailability(tourId: string, date: string, peopleCount: number, partnerId: string, isGroup: boolean): Promise<void> {
    console.log('updateTourAvailability called with:', { tourId, date, peopleCount, partnerId, isGroup });
    
    const tour = await this.toursService.findOne(tourId);
    if (!tour || !tour.availability) {
      console.log('Tour not found or no availability:', { tour: !!tour, availability: !!tour?.availability });
      return;
    }

    console.log('Tour details:', { id: tour.id, type: tour.type, availability: tour.availability });

    // Нормализуем дату к формату ISO (YYYY-MM-DD)
    let normalizedDate = date;
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(date)) {
      const [day, month, year] = date.split('.');
      normalizedDate = `${year}-${month}-${day}`;
    }
    
    console.log('Date normalized from', date, 'to', normalizedDate);

    const updatedAvailability = tour.availability.map(item => {
      // Нормализуем дату из item тоже для правильного сравнения
      let itemNormalizedDate = item.date;
      if (/^\d{2}\.\d{2}\.\d{4}$/.test(item.date)) {
        const [day, month, year] = item.date.split('.');
        itemNormalizedDate = `${year}-${month}-${day}`;
      }
      
      if (itemNormalizedDate === normalizedDate) {
        // Определяем нужно ли закрыть все слоты на день:
        // 1. PRIVATE туры - всегда закрывают весь день (индивидуальная экскурсия)
        // 2. GROUP туры с isGroup=true - "выкуп" всего тура на день (корпоративы, большие группы)
        // 3. GROUP туры с isGroup=false - обычное присоединение к группе (уменьшаем слоты на количество людей)
        const shouldCloseAllSlots = tour.type === TourType.PRIVATE || (tour.type === TourType.GROUP && isGroup);
        
        console.log('Processing availability item:', {
          originalItemDate: item.date,
          itemNormalizedDate,
          normalizedBookingDate: normalizedDate,
          tourType: tour.type,
          isGroup,
          shouldCloseAllSlots,
          currentSlots: item.available_slots,
          peopleCount
        });
        
        const newAvailableSlots = shouldCloseAllSlots ? 0 : Math.max(0, item.available_slots - peopleCount);
        
        console.log('Updating slots from', item.available_slots, 'to', newAvailableSlots);
        
        return {
          ...item,
          available_slots: newAvailableSlots
        };
      }
      return item;
    });

    console.log('Updated availability:', updatedAvailability);
    await this.toursService.updateAvailabilityByPartnerId(tourId, updatedAvailability, partnerId);
    console.log('Availability updated successfully');
  }

  private async returnTourAvailability(tourId: string, date: Date, peopleCount: number, partnerId: string): Promise<void> {
    const tour = await this.toursService.findOne(tourId);
    if (!tour || !tour.availability) {
      return;
    }

    const dateObj = date instanceof Date ? date : new Date(date);
    const dateString = dateObj.toISOString().split('T')[0];
    const updatedAvailability = tour.availability.map(item => {
      if (item.date === dateString) {
        return {
          ...item,
          available_slots: Math.min(item.total_slots, item.available_slots + peopleCount)
        };
      }
      return item;
    });

    await this.toursService.updateAvailabilityByPartnerId(tourId, updatedAvailability, partnerId);
  }

  async getBookingStats(partnerId?: string): Promise<any> {
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoin('booking.tour', 'tour');

    if (partnerId) {
      queryBuilder.andWhere('tour.partner_id = :partnerId', { partnerId });
    }

    const stats = await queryBuilder
      .select([
        'booking.status',
        'COUNT(*) as count',
        'SUM(booking.total_price) as total_revenue'
      ])
      .groupBy('booking.status')
      .getRawMany();

    return stats.reduce((acc, stat) => {
      acc[stat.booking_status] = {
        count: parseInt(stat.count),
        revenue: parseFloat(stat.total_revenue || '0')
      };
      return acc;
    }, {});
  }
}
