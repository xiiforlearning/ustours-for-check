import { Injectable, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Tour } from './entities/tour.entity';
import { CreateTourDto } from './dto/create-tour.dto';
import { TourFiltersDto, SortField, SortOrder } from './dto/tour-filters.dto';
import { UsersService } from '../users/users.service';
import { CurrencyService } from '../currency/currency.service';
import * as moment from 'moment-timezone';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour)
    private readonly tourRepository: Repository<Tour>,
    private readonly usersService: UsersService,
    private readonly currencyService: CurrencyService,
  ) {}

  async create(createTourDto: Omit<CreateTourDto, 'partner_id'>, userId: string): Promise<Tour> {
    // Find partner by user ID from JWT
    const partner = await this.usersService.findPartnerByUserId(userId);
    if (!partner) {
      throw new NotFoundException('Partner not found for this user');
    }

    // Проверка на дубли дат в availability
    if (createTourDto.availability) {
      const seenDates = new Set();
      for (const item of createTourDto.availability) {
        let itemDateISO = item.date;
        if (/^\d{2}\.\d{2}\.\d{4}$/.test(item.date)) {
          const [day, month, year] = item.date.split('.');
          itemDateISO = `${year}-${month}-${day}`;
        }
        if (seenDates.has(itemDateISO)) {
          throw new BadRequestException(`Duplicate date found in availability: ${item.date}`);
        }
        seenDates.add(itemDateISO);
      }
    }

    // Синхронизируем available_dates с availability
    const availability = createTourDto.availability ?? [];
    const available_dates = availability.map(item => item.date).filter(Boolean);

    const tourData = {
      ...createTourDto,
      partner_id: partner.id, // Use partner ID from database, not from DTO
      photos: createTourDto.photos ?? [],
      languages: createTourDto.languages ?? [],
      days: createTourDto.days ?? [],
      included: createTourDto.included ?? [],
      excluded: createTourDto.excluded ?? [],
      available_dates: available_dates,
      availability: availability,
      city: createTourDto.city ?? [],
      status: createTourDto.status ?? undefined,
      rating: createTourDto.rating ?? undefined,
      description: createTourDto.description ?? undefined,
      duration: createTourDto.duration ?? undefined,
      duration_unit: createTourDto.duration_unit ?? undefined,
      type: createTourDto.type ?? undefined,
      min_persons: createTourDto.min_persons ?? undefined,
      max_persons: createTourDto.max_persons ?? undefined,
      departure: createTourDto.departure ?? undefined,
      price: createTourDto.price ?? undefined,
      group_price: createTourDto.group_price ?? undefined,
      currency: createTourDto.currency || 'USD', // <-- default USD
      difficulty: createTourDto.difficulty ?? undefined,
      departure_time: createTourDto.departure_time ?? undefined,
      child_price: createTourDto.child_price ?? undefined,
      rejection_reason: createTourDto.rejection_reason ?? undefined,
      route_points: createTourDto.route_points ?? undefined,
      main_photo: createTourDto.main_photo ?? undefined,
      departure_city: createTourDto.departure_city ?? undefined,
      departure_lat: createTourDto.departure_lat ?? undefined,
      departure_lng: createTourDto.departure_lng ?? undefined,
      departure_address: createTourDto.departure_address ?? undefined,
      departure_landmark: createTourDto.departure_landmark ?? undefined,
      created_at: createTourDto.created_at ?? undefined,
      updated_at: createTourDto.updated_at ?? undefined,
    };
    
    const tour = this.tourRepository.create(tourData);
    return this.tourRepository.save(tour);
  }

  async findAll(
    filters?: TourFiltersDto,
    partner_id?: string,
    currency?: string
  ): Promise<{ tours: any[]; total: number; page: number; limit: number; totalPages: number }> {
    console.log('ToursService.findAll called with partner_id:', partner_id);
    
    const queryBuilder = this.tourRepository
      .createQueryBuilder('tour')
      .leftJoinAndSelect('tour.partner', 'partner');

    if (partner_id) {
      console.log('Adding partner_id filter:', partner_id);
      queryBuilder.andWhere('tour.partner_id = :partner_id', { partner_id });
    } else {
      console.log('Adding active status filter');
      queryBuilder.andWhere('tour.status = :status', { status: 'active' });
    }

    // Фильтрация по цене с учётом валюты
    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      // Подключаем таблицу курсов валют для тура
      queryBuilder.leftJoin('currency_rates', 'cr_from', 'cr_from.code = tour.currency');
      
      const targetCurrency = currency || 'USD';
      const toRate = await this.currencyService.getCurrencyRate(targetCurrency).then(r => r.rate);
      
      if (toRate) {
        if (filters.minPrice !== undefined) {
          const minPriceUZS = filters.minPrice * toRate;
          queryBuilder.andWhere('(tour.price * cr_from.rate) >= :minPriceUZS', { minPriceUZS });
        }
        if (filters.maxPrice !== undefined) {
          const maxPriceUZS = filters.maxPrice * toRate;
          queryBuilder.andWhere('(tour.price * cr_from.rate) <= :maxPriceUZS', { maxPriceUZS });
        }
      }
    }

    // Применяем фильтры, передавая информацию о том, является ли это запросом партнёра
    this.applyFilters(queryBuilder, filters, !!partner_id);
    this.applySorting(queryBuilder, filters);

    const total = await queryBuilder.getCount();

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const offset = (page - 1) * limit;

    queryBuilder.skip(offset).take(limit);

    const tours = await queryBuilder.getMany();
    
    console.log('Found tours count:', tours.length);
    console.log('Tours found:', tours.map(t => ({ id: t.id, title: t.title, partner_id: t.partner_id, status: t.status })));

    // --- Пересчёт цен в нужную валюту ---
    let resultTours: any[] = tours;
    if (currency) {
      const toRate = await this.currencyService.getCurrencyRate(currency).then(r => r.rate);
      if (!toRate) throw new BadRequestException('Currency rate not found');
      resultTours = await Promise.all(tours.map(async tour => {
        if (!tour.price) return { ...tour, price: null, currency };
        const fromCurrency = tour.currency || 'USD';
        const fromRate = await this.currencyService.getCurrencyRate(fromCurrency).then(r => r.rate);
        if (!fromRate) return { ...tour, price: null, currency };
        const priceInUZS = tour.price * fromRate;
        const priceInTarget = priceInUZS / toRate;
        return { ...tour, price: priceInTarget, currency: currency };
      }));
    }

    return {
      tours: resultTours,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  private applyFilters(queryBuilder: SelectQueryBuilder<Tour>, filters?: TourFiltersDto, isPartnerRequest: boolean = false): void {
    if (!filters) return;

    if (filters.city && filters.city.length > 0) {
      // Принудительно преобразуем в массив, если это строка
      const cities = Array.isArray(filters.city) ? filters.city : [filters.city];
      const cityConditions = cities.map((city, index) => 
        `'${city}' = ANY(tour.city)`
      ).join(' OR ');
      queryBuilder.andWhere(`(${cityConditions})`);
    }

    if (filters.date) {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const currentTime = moment().tz('Asia/Tashkent').format('HH:mm:ss');
      // SQL выражение для приведения даты к ISO-формату
      const dateExpr = `CASE WHEN availability_item->>'date' ~ '^\\d{2}\\.\\d{2}\\.\\d{4}$' THEN to_char(to_date(availability_item->>'date', 'DD.MM.YYYY'), 'YYYY-MM-DD') ELSE availability_item->>'date' END`;
      // Проверяем, что запрашиваемая дата не в прошлом
      if (filters.date < today) {
        queryBuilder.andWhere('1 = 0'); // Всегда false
      } else if (filters.date === today) {
        queryBuilder.andWhere(
          `EXISTS (SELECT 1 FROM jsonb_array_elements(tour.availability) AS availability_item WHERE ${dateExpr} = :date)`,
          { date: filters.date }
        );
        queryBuilder.andWhere('(tour.departure_time IS NULL OR tour.departure_time > :currentTime)', { currentTime });
      } else {
        queryBuilder.andWhere(
          `EXISTS (SELECT 1 FROM jsonb_array_elements(tour.availability) AS availability_item WHERE ${dateExpr} = :date)`,
          { date: filters.date }
        );
      }
    }

    // Фильтрация по датам - исключаем туры с прошедшими датами и проверяем departure_time
    // НО ТОЛЬКО ДЛЯ ОБЫЧНЫХ ПОЛЬЗОВАТЕЛЕЙ, НЕ ДЛЯ ПАРТНЁРОВ
    if (!isPartnerRequest) {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const currentTime = moment().tz('Asia/Tashkent').format('HH:mm:ss');

      // SQL выражение для приведения даты к ISO-формату
      const dateExpr = `CASE WHEN availability_item->>'date' ~ '^\\d{2}\\.\\d{2}\\.\\d{4}$' THEN to_char(to_date(availability_item->>'date', 'DD.MM.YYYY'), 'YYYY-MM-DD') ELSE availability_item->>'date' END`;

      queryBuilder.andWhere(
        `EXISTS (
          SELECT 1 FROM jsonb_array_elements(tour.availability) AS availability_item 
          WHERE ${dateExpr} >= :today 
          AND (availability_item->>'available_slots')::int > 0
          AND (
            ${dateExpr} > :today 
            OR (
              ${dateExpr} = :today 
              AND (tour.departure_time IS NULL OR tour.departure_time > :currentTime)
            )
          )
        )`,
        { today, currentTime }
      );
    }

    if (filters.type) {
      queryBuilder.andWhere('tour.type = :type', { type: filters.type });
    }

    // Фильтрация по языкам
    if (filters.languages && filters.languages.length > 0) {
      // Принудительно преобразуем в массив, если это строка
      const languages = Array.isArray(filters.languages) ? filters.languages : [filters.languages];
      const languageConditions = languages.map((lang) => 
        `'${lang}' = ANY(tour.languages)`
      ).join(' OR ');
      queryBuilder.andWhere(`(${languageConditions})`);
    }

    if (filters.minDuration !== undefined) {
      queryBuilder.andWhere('tour.duration >= :minDuration', { minDuration: filters.minDuration });
    }
    if (filters.maxDuration !== undefined) {
      queryBuilder.andWhere('tour.duration <= :maxDuration', { maxDuration: filters.maxDuration });
    }

    if (filters.difficulty) {
      queryBuilder.andWhere('tour.difficulty = :difficulty', { difficulty: filters.difficulty });
    }
  }

  private applySorting(queryBuilder: SelectQueryBuilder<Tour>, filters?: TourFiltersDto): void {
    if (!filters) {
      queryBuilder.orderBy('tour.created_at', 'DESC');
      return;
    }

    const sortBy = filters.sortBy || SortField.CREATED_AT;
    const sortOrder = filters.sortOrder || SortOrder.DESC;

    switch (sortBy) {
      case SortField.PRICE:
        queryBuilder.orderBy('tour.price', sortOrder as 'ASC' | 'DESC');
        break;
      case SortField.RATING:
        queryBuilder.orderBy('tour.rating', sortOrder as 'ASC' | 'DESC');
        break;
      case SortField.CREATED_AT:
        queryBuilder.orderBy('tour.created_at', sortOrder as 'ASC' | 'DESC');
        break;
      case SortField.POPULARITY:
        queryBuilder
          .leftJoin('tour.bookings', 'booking')
          .addSelect('COUNT(booking.id)', 'bookingCount')
          .groupBy('tour.id')
          .orderBy('bookingCount', sortOrder as 'ASC' | 'DESC');
        break;
      default:
        queryBuilder.orderBy('tour.created_at', 'DESC');
    }
  }

  async findOne(id: string): Promise<Tour | null> {
    return this.tourRepository.createQueryBuilder('tour')
      .leftJoinAndSelect('tour.partner', 'partner')
      .where('tour.id = :id', { id })
      .getOne();
  }

  async update(id: string, updateTourDto: Partial<CreateTourDto>, userId: string): Promise<Tour | null> {
    // Find partner by user ID from JWT
    const partner = await this.usersService.findPartnerByUserId(userId);
    if (!partner) {
      throw new NotFoundException('Partner not found for this user');
    }

    const tour = await this.tourRepository.findOne({ where: { id } });
    if (!tour) return null;
    
    if (tour.partner_id !== partner.id) {
      throw new ForbiddenException('You can only update your own tours');
    }

    // Проверка на дубли дат в availability (только внутри нового массива)
    if (updateTourDto.availability) {
      const seenDates = new Set();
      for (const item of updateTourDto.availability) {
        let itemDateISO = item.date;
        if (/^\d{2}\.\d{2}\.\d{4}$/.test(item.date)) {
          const [day, month, year] = item.date.split('.');
          itemDateISO = `${year}-${month}-${day}`;
        }
        if (seenDates.has(itemDateISO)) {
          throw new BadRequestException(`Duplicate date found in availability: ${item.date}`);
        }
        seenDates.add(itemDateISO);
      }
    }

    // Синхронизируем available_dates с availability
    const availability = updateTourDto.availability ?? [];
    const available_dates = availability.map(item => item.date).filter(Boolean);

    // Полностью заменяем availability новым массивом
    const updateData = { ...updateTourDto, available_dates, availability };
    if (updateData.currency === undefined) {
      updateData.currency = 'USD';
    }
    await this.tourRepository.update(id, updateData as any);
    return this.findOne(id);
  }

  async updateAvailability(id: string, availability: any[], userId: string): Promise<Tour | null> {
    // Find partner by user ID from JWT
    const partner = await this.usersService.findPartnerByUserId(userId);
    if (!partner) {
      throw new NotFoundException('Partner not found for this user');
    }

    const tour = await this.tourRepository.findOne({ where: { id } });
    if (!tour) return null;
    
    if (tour.partner_id !== partner.id) {
      throw new ForbiddenException('You can only update availability of your own tours');
    }
    
    for (const item of availability) {
      if (item.available_slots > item.total_slots) {
        throw new BadRequestException(`Available slots (${item.available_slots}) cannot be greater than total slots (${item.total_slots}) for date ${item.date}`);
      }
      if (item.available_slots < 0) {
        throw new BadRequestException(`Available slots cannot be negative for date ${item.date}`);
      }
    }
    
    // Синхронизируем available_dates с availability
    const available_dates = availability.map(item => item.date).filter(Boolean);
    
    await this.tourRepository.update(id, { availability, available_dates });
    return this.findOne(id);
  }

  async updateAvailabilityByPartnerId(id: string, availability: any[], partnerId: string): Promise<Tour | null> {
    const tour = await this.tourRepository.findOne({ where: { id } });
    if (!tour) return null;
    
    if (tour.partner_id !== partnerId) {
      throw new ForbiddenException('You can only update availability of your own tours');
    }
    
    for (const item of availability) {
      if (item.available_slots > item.total_slots) {
        throw new BadRequestException(`Available slots (${item.available_slots}) cannot be greater than total slots (${item.total_slots}) for date ${item.date}`);
      }
      if (item.available_slots < 0) {
        throw new BadRequestException(`Available slots cannot be negative for date ${item.date}`);
      }
    }
    
    // Синхронизируем available_dates с availability
    const available_dates = availability.map(item => item.date).filter(Boolean);
    
    await this.tourRepository.update(id, { availability, available_dates });
    return this.findOne(id);
  }

  async getPopularTours(limit: number = 10): Promise<any[]> {
    return this.tourRepository
      .createQueryBuilder('tour')
      .leftJoinAndSelect('tour.partner', 'partner')
      .leftJoin('tour.bookings', 'booking')
      .addSelect('COUNT(booking.id)', 'bookingCount')
      .where('tour.status = :status', { status: 'active' })
      .groupBy('tour.id')
      .addGroupBy('partner.id')
      .orderBy('bookingCount', 'DESC')
      .limit(limit)
      .getRawAndEntities()
      .then(result => {
        return result.entities.map((tour, index) => ({
          ...tour,
          bookingCount: parseInt(result.raw[index].bookingCount)
        }));
      });
  }

  async getCities(): Promise<string[]> {
    const result = await this.tourRepository
      .createQueryBuilder('tour')
      .select('DISTINCT unnest(tour.city)', 'city')
      .where('tour.city IS NOT NULL')
      .andWhere('tour.status = :status', { status: 'active' })
      .orderBy('city', 'ASC')
      .getRawMany();
    return result.map(item => item.city);
  }

  async getLanguages(): Promise<string[]> {
    const result = await this.tourRepository
      .createQueryBuilder('tour')
      .select('DISTINCT unnest(tour.languages)', 'language')
      .where('tour.languages IS NOT NULL')
      .andWhere('tour.status = :status', { status: 'active' })
      .orderBy('language', 'ASC')
      .getRawMany();
    
    return result.map(item => item.language);
  }

  async remove(id: string, userId: string): Promise<void> {
    // Find partner by user ID from JWT
    const partner = await this.usersService.findPartnerByUserId(userId);
    if (!partner) {
      throw new NotFoundException('Partner not found for this user');
    }
    const tour = await this.tourRepository.findOne({ where: { id } });
    if (!tour) {
      throw new NotFoundException('Tour not found');
    }
    if (tour.partner_id !== partner.id) {
      throw new ForbiddenException('You can only delete your own tours');
    }
    await this.tourRepository.delete(id);
  }

  async getTourPrice(tourId: string, targetCurrency: string = 'UZS') {
    const tour = await this.tourRepository.findOne({ where: { id: tourId } });
    if (!tour) throw new NotFoundException('Tour not found');
    if (!tour.price || !tour.currency) throw new BadRequestException('Tour price or currency not set');

    const fromRate = await this.currencyService.getCurrencyRate(tour.currency).then(r => r.rate); // курс валюты тура к UZS
    const toRate = await this.currencyService.getCurrencyRate(targetCurrency).then(r => r.rate);  // курс целевой валюты к UZS

    if (!fromRate || !toRate) {
      throw new BadRequestException('Currency rate not found');
    }

    // Переводим цену в UZS, затем в целевую валюту
    const priceInUZS = tour.price * fromRate;
    const priceInTarget = priceInUZS / toRate;

    return { price: priceInTarget, currency: targetCurrency };
  }

  /**
   * Очищает прошедшие даты из доступности туров
   * Этот метод можно вызывать по расписанию или при запросах
   */
  async cleanupExpiredDates(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    
    // Получаем все туры с прошедшими датами
    const toursWithExpiredDates = await this.tourRepository
      .createQueryBuilder('tour')
      .where('tour.availability IS NOT NULL')
      .andWhere('tour.availability != \'[]\'::jsonb')
      .getMany();

    for (const tour of toursWithExpiredDates) {
      if (tour.availability && Array.isArray(tour.availability)) {
        // Фильтруем только будущие даты
        const validAvailability = tour.availability.filter(item => {
          if (item && item.date) {
            // Преобразуем дату к ISO-формату (YYYY-MM-DD), если она в формате DD.MM.YYYY
            let itemDateISO = item.date;
            if (/^\d{2}\.\d{2}\.\d{4}$/.test(item.date)) {
              const [day, month, year] = item.date.split('.');
              itemDateISO = `${year}-${month}-${day}`;
            }
            return itemDateISO >= today;
          }
          return false;
        });

        // Обновляем тур только если есть изменения
        if (validAvailability.length !== tour.availability.length) {
          // Синхронизируем available_dates с отфильтрованной availability
          const available_dates = validAvailability.map(item => item.date).filter(Boolean);
          await this.tourRepository.update(tour.id, { availability: validAvailability, available_dates });
        }
      }
    }
  }

  /**
   * Проверяет доступность тура на конкретную дату
   */
  async checkTourAvailability(tourId: string, date: string): Promise<{ available: boolean; availableSlots: number; totalSlots: number }> {
    const tour = await this.tourRepository.findOne({ where: { id: tourId } });
    if (!tour) throw new NotFoundException('Tour not found');

    const today = new Date().toISOString().split('T')[0];
    const currentTime = moment().tz('Asia/Tashkent').format('HH:mm:ss');
    
    // Проверяем, что дата не в прошлом
    if (date < today) {
      return { available: false, availableSlots: 0, totalSlots: 0 };
    }

    // Если дата сегодня, проверяем departure_time
    if (date === today && tour.departure_time) {
      if (tour.departure_time <= currentTime) {
        return { available: false, availableSlots: 0, totalSlots: 0 };
      }
    }

    if (tour.availability && Array.isArray(tour.availability)) {
      const availabilityItem = tour.availability.find(item => item.date === date);
      if (availabilityItem) {
        return {
          available: availabilityItem.available_slots > 0,
          availableSlots: availabilityItem.available_slots,
          totalSlots: availabilityItem.total_slots
        };
      }
    }

    return { available: false, availableSlots: 0, totalSlots: 0 };
  }
}
