import { Injectable, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Tour } from './entities/tour.entity';
import { CreateTourDto } from './dto/create-tour.dto';
import { TourFiltersDto, SortField, SortOrder } from './dto/tour-filters.dto';
import { UsersService } from '../users/users.service';
import { CurrencyService } from '../currency/currency.service';

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

    const tourData = {
      ...createTourDto,
      partner_id: partner.id, // Use partner ID from database, not from DTO
      photos: createTourDto.photos ?? [],
      languages: createTourDto.languages ?? [],
      days: createTourDto.days ?? [],
      included: createTourDto.included ?? [],
      excluded: createTourDto.excluded ?? [],
      available_dates: createTourDto.available_dates ?? [],
      availability: createTourDto.availability ?? [],
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
    const queryBuilder = this.tourRepository
      .createQueryBuilder('tour')
      .leftJoinAndSelect('tour.partner', 'partner');

    if (partner_id) {
      queryBuilder.andWhere('tour.partner_id = :partner_id', { partner_id });
    } else {
      queryBuilder.andWhere('tour.status = :status', { status: 'active' });
    }

    // Фильтрация по цене с учётом валюты
    let minPriceUZS: number | undefined;
    let maxPriceUZS: number | undefined;
    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      const targetCurrency = (filters as any).price || 'UZS';
      const toRate = await this.currencyService.getCurrencyRate(targetCurrency).then(r => r.rate);
      if (toRate) {
        if (filters.minPrice !== undefined) {
          minPriceUZS = filters.minPrice * toRate;
        }
        if (filters.maxPrice !== undefined) {
          maxPriceUZS = filters.maxPrice * toRate;
        }
      }
    }

    this.applyFilters(queryBuilder, filters);

    // Применяем фильтрацию по цене в UZS
    if (minPriceUZS !== undefined) {
      queryBuilder.andWhere('(tour.price * cr_from.Rate) >= :minPriceUZS', { minPriceUZS });
    }
    if (maxPriceUZS !== undefined) {
      queryBuilder.andWhere('(tour.price * cr_from.Rate) <= :maxPriceUZS', { maxPriceUZS });
    }

    this.applySorting(queryBuilder, filters);

    const total = await queryBuilder.getCount();

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const offset = (page - 1) * limit;

    queryBuilder.skip(offset).take(limit);

    const tours = await queryBuilder.getMany();

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

  private applyFilters(queryBuilder: SelectQueryBuilder<Tour>, filters?: TourFiltersDto): void {
    if (!filters) return;

    if (filters.city && filters.city.length > 0) {
      queryBuilder.andWhere(
        `EXISTS (SELECT 1 FROM unnest(tour.city) AS c WHERE c = ANY(:cities))`,
        { cities: filters.city }
      );
    }

    if (filters.date) {
      queryBuilder.andWhere(
        'EXISTS (SELECT 1 FROM jsonb_array_elements(tour.availability) AS availability_item WHERE availability_item->>\'date\' = :date)',
        { date: filters.date }
      );
    }

    if (filters.type) {
      queryBuilder.andWhere('tour.type = :type', { type: filters.type });
    }

    if (filters.languages && filters.languages.length > 0) {
      const languageConditions = filters.languages.map((_, index) => 
        `EXISTS (SELECT 1 FROM unnest(tour.languages) AS lang WHERE lang = :lang${index})`
      ).join(' AND ');
      
      const languageParams = filters.languages.reduce((acc, lang, index) => {
        acc[`lang${index}`] = lang;
        return acc;
      }, {} as Record<string, string>);

      queryBuilder.andWhere(`(${languageConditions})`, languageParams);
    }

    if (filters.minPrice !== undefined) {
      queryBuilder.andWhere('tour.price >= :minPrice', { minPrice: filters.minPrice });
    }
    if (filters.maxPrice !== undefined) {
      queryBuilder.andWhere('tour.price <= :maxPrice', { maxPrice: filters.maxPrice });
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
    
    // Если не указана currency, сохраняем USD по умолчанию
    const updateData = { ...updateTourDto };
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
    
    await this.tourRepository.update(id, { availability });
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
    
    await this.tourRepository.update(id, { availability });
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
}
