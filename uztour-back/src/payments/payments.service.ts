import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentMethod, Currency } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { OctoService } from './services/octo.service';
import { BookingsService } from '../bookings/bookings.service';
import { UsersService } from '../users/users.service';
import { BookingStatus } from '../bookings/dto/create-booking.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly octoService: OctoService,
    private readonly bookingsService: BookingsService,
    private readonly usersService: UsersService,
  ) {}

  
  async createPayment(createPaymentDto: CreatePaymentDto, userId: string): Promise<{ payment: Payment; paymentUrl: string }> {
    const booking = await this.bookingsService.findOne(createPaymentDto.bookingId, userId);
    
    if (!booking) {
      throw new NotFoundException('Бронирование не найдено');
    }

    if (booking.status !== 'pending') {
      throw new BadRequestException('Бронирование уже оплачено или отменено');
    }

    const existingPayment = await this.paymentRepository.findOne({
      where: {
        booking_id: createPaymentDto.bookingId,
        status: PaymentStatus.PENDING,
      },
    });

    if (existingPayment) {
      throw new BadRequestException('Для этого бронирования уже создан активный платеж');
    }

    const user = await this.usersService.updateUser(userId, {});

    const payment = this.paymentRepository.create({
      amount: booking.total_price,
      currency: Currency.UZS,
      status: PaymentStatus.PENDING,
      paymentMethod: createPaymentDto.paymentMethod,
      shopTransactionId: this.octoService.generateShopTransactionId(createPaymentDto.bookingId),
      description: `Оплата бронирования тура: ${booking.tour?.title || 'Тур'}`,
      userData: createPaymentDto.userData || {
        userId: user.id,
        phone: user.partner?.phone || '',
        email: user.email || '',
      },
      basket: createPaymentDto.basket || [{
        positionDesc: booking.tour?.title || 'Тур',
        count: booking.adults_count + booking.children_count,
        price: booking.total_price / (booking.adults_count + booking.children_count),
        spic: `Взрослых: ${booking.adults_count}, Детей: ${booking.children_count}`,
      }],
      returnUrl: createPaymentDto.returnUrl || 'http://localhost:3000/payment/success',
      notifyUrl: createPaymentDto.notifyUrl || 'http://localhost:3000/payments/notify',
      language: createPaymentDto.language || 'ru',
      ttl: createPaymentDto.ttl || 15,
      test: createPaymentDto.test ?? true,
      autoCapture: createPaymentDto.autoCapture ?? true,
      initTime: new Date(),
      user_id: userId,
      booking_id: createPaymentDto.bookingId,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    const octoResponse = await this.octoService.preparePayment(savedPayment, createPaymentDto);

    if (!octoResponse.data?.payment_url) {
      throw new BadRequestException('Не удалось получить URL для оплаты');
    }

    await this.paymentRepository.update(savedPayment.id, {
      octoTransactionId: octoResponse.data.transaction_id,
      status: PaymentStatus.PROCESSING,
    });

    this.logger.log(`Payment created for booking ${createPaymentDto.bookingId}: ${octoResponse.data.transaction_id}`);

    return {
      payment: savedPayment,
      paymentUrl: octoResponse.data.payment_url,
    };
  }

  
  async findOne(id: string, userId?: string): Promise<Payment> {
    const queryBuilder = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.booking', 'booking')
      .leftJoinAndSelect('payment.user', 'user')
      .leftJoinAndSelect('booking.tour', 'tour')
      .where('payment.id = :id', { id });

    if (userId) {
      queryBuilder.andWhere('payment.user_id = :userId', { userId });
    }

    const payment = await queryBuilder.getOne();
    if (!payment) {
      throw new NotFoundException('Платеж не найден');
    }

    return payment;
  }

  
  async findAll(userId?: string): Promise<Payment[]> {
    const queryBuilder = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.booking', 'booking')
      .leftJoinAndSelect('payment.user', 'user')
      .leftJoinAndSelect('booking.tour', 'tour');

    if (userId) {
      queryBuilder.andWhere('payment.user_id = :userId', { userId });
    }

    return queryBuilder.orderBy('payment.createdAt', 'DESC').getMany();
  }

  
  async processNotification(notification: any): Promise<void> {
    this.logger.log(`Processing notification for transaction ${notification.transaction_id}`);

    const payment = await this.paymentRepository.findOne({
      where: { octoTransactionId: notification.transaction_id },
      relations: ['booking'],
    });

    if (!payment) {
      this.logger.error(`Payment not found for OCTO transaction ${notification.transaction_id}`);
      return;
    }

    const result = await this.octoService.processNotification(notification);

    if (result.success) {
      await this.paymentRepository.update(payment.id, {
        status: PaymentStatus.SUCCESS,
        processedAt: new Date(),
        metadata: { ...payment.metadata, notification },
      });

      if (!payment.booking_id) throw new Error('booking_id is missing');
      await this.bookingsService.update(payment.booking_id, {
        status: 'confirmed' as any,
        comment: 'Бронирование подтверждено после успешной оплаты',
      });

      this.logger.log(`Payment ${payment.id} completed successfully`);
    } else {
      await this.paymentRepository.update(payment.id, {
        status: PaymentStatus.FAILED,
        failedAt: new Date(),
        failureReason: result.message,
        metadata: { ...payment.metadata, notification },
      });

      this.logger.log(`Payment ${payment.id} failed: ${result.message}`);
    }
  }

  
  async cancelPayment(id: string, userId: string): Promise<Payment> {
    const payment = await this.findOne(id, userId);

    if (payment.status !== PaymentStatus.PENDING && payment.status !== PaymentStatus.PROCESSING) {
      throw new BadRequestException('Платеж нельзя отменить');
    }

    await this.paymentRepository.update(id, {
      status: PaymentStatus.CANCELLED,
      failedAt: new Date(),
      failureReason: 'Отменен пользователем',
    });

    return this.findOne(id, userId);
  }

  
  async getPaymentStats(userId?: string): Promise<any> {
    const queryBuilder = this.paymentRepository
      .createQueryBuilder('payment');

    if (userId) {
      queryBuilder.andWhere('payment.user_id = :userId', { userId });
    }

    const stats = await queryBuilder
      .select([
        'payment.status',
        'COUNT(*) as count',
        'SUM(payment.amount) as total_amount'
      ])
      .groupBy('payment.status')
      .getRawMany();

    return stats.reduce((acc, stat) => {
      acc[stat.payment_status] = {
        count: parseInt(stat.count),
        amount: parseFloat(stat.total_amount || '0')
      };
      return acc;
    }, {});
  }

  async handleOctoNotify(body: any): Promise<any> {
    // Найти платеж по shop_transaction_id или octo_payment_UUID
    const payment = await this.paymentRepository.findOne({
      where: [
        { shopTransactionId: body.shop_transaction_id },
        { octoTransactionId: body.octo_payment_UUID }
      ],
      relations: ['booking'],
    });

    if (!payment) {
      this.logger.error(`Payment not found for notify: shop_transaction_id=${body.shop_transaction_id}, octo_payment_UUID=${body.octo_payment_UUID}`);
      return { error: 1, message: 'Payment not found' };
    }

    // Обновим статус платежа
    if (body.status === 'succeeded') {
      payment.status = PaymentStatus.SUCCESS;
    } else if (body.status === 'failed' || body.status === 'cancelled') {
      payment.status = PaymentStatus.FAILED;
    } else {
      payment.status = PaymentStatus.PROCESSING;
    }
    payment.octoTransactionId = body.octo_payment_UUID;
    payment.metadata = { ...payment.metadata, octo_notify: body };
    await this.paymentRepository.save(payment);

    // Обновим статус бронирования, если нужно
    if (payment.booking) {
      if (body.status === 'succeeded') {
        payment.booking.status = BookingStatus.CONFIRMED;
      } else if (body.status === 'failed' || body.status === 'cancelled') {
        payment.booking.status = BookingStatus.CANCELLED;
      }
      if (!payment.booking_id) throw new Error('booking_id is missing');
      await this.bookingsService.update(payment.booking_id, {
        status: payment.booking.status,
        comment: body.status === 'succeeded' ? 'Бронирование подтверждено после успешной оплаты' : 'Бронирование отменено',
      });
    }

    return { error: 0, message: 'ok' };
  }
}
