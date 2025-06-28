import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Tour } from './entities/tour.entity';
import { CreateTourDto } from './dto/create-tour.dto';
import { TourFiltersDto, SortField, SortOrder } from './dto/tour-filters.dto';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour)
    private readonly tourRepository: Repository<Tour>,
  ) {}

  async create(createTourDto: CreateTourDto): Promise<Tour> {
    const { partner_id, ...rest } = createTourDto;
    if (!partner_id) {
      throw new BadRequestException('partner_id is required');
    }
    
    // Устанавливаем значения по умолчанию для массивов
    const tourData = {
      ...rest,
      partner_id,
      photos: rest.photos || [],
      languages: rest.languages || [],
      days: rest.days || [],
      included: rest.included || [],
      excluded: rest.excluded || [],
      available_dates: rest.available_dates || [],
      availability: rest.availability || [],
    };
    
    const tour = this.tourRepository.create(tourData);
    return this.tourRepository.save(tour);
  }

  async findAll(filters?: TourFiltersDto, partner_id?: string): Promise<{ tours: Tour[]; total: number; page: number; limit: number; totalPages: number }> {
    const queryBuilder = this.tourRepository
      .createQueryBuilder('tour')
      .leftJoinAndSelect('tour.partner', 'partner');

    // Фильтр по partner_id (если передан)
    if (partner_id) {
      queryBuilder.andWhere('tour.partner_id = :partner_id', { partner_id });
    } else {
      // Для публичного API показываем только активные туры
      queryBuilder.andWhere('tour.status = :status', { status: 'active' });
    }

    // Применяем фильтры
    this.applyFilters(queryBuilder, filters);

    // Применяем сортировку
    this.applySorting(queryBuilder, filters);

    // Получаем общее количество записей
    const total = await queryBuilder.getCount();

    // Применяем пагинацию
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const offset = (page - 1) * limit;

    queryBuilder.skip(offset).take(limit);

    const tours = await queryBuilder.getMany();

    return {
      tours,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  private applyFilters(queryBuilder: SelectQueryBuilder<Tour>, filters?: TourFiltersDto): void {
    if (!filters) return;

    // Фильтр по городу
    if (filters.city) {
      queryBuilder.andWhere('LOWER(tour.city) LIKE LOWER(:city)', { 
        city: `%${filters.city}%` 
      });
    }

    // Фильтр по дате
    if (filters.date) {
      queryBuilder.andWhere(
        'EXISTS (SELECT 1 FROM jsonb_array_elements(tour.availability) AS availability_item WHERE availability_item->>\'date\' = :date)',
        { date: filters.date }
      );
    }

    // Фильтр по типу экскурсии
    if (filters.type) {
      queryBuilder.andWhere('tour.type = :type', { type: filters.type });
    }

    // Фильтр по языкам
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

    // Фильтр по цене
    if (filters.minPrice !== undefined) {
      queryBuilder.andWhere('tour.price >= :minPrice', { minPrice: filters.minPrice });
    }
    if (filters.maxPrice !== undefined) {
      queryBuilder.andWhere('tour.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    // Фильтр по длительности
    if (filters.minDuration !== undefined) {
      queryBuilder.andWhere('tour.duration >= :minDuration', { minDuration: filters.minDuration });
    }
    if (filters.maxDuration !== undefined) {
      queryBuilder.andWhere('tour.duration <= :maxDuration', { maxDuration: filters.maxDuration });
    }

    // Фильтр по сложности
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
        // Сортировка по популярности (количество бронирований)
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
    return this.tourRepository.findOne({ where: { id } });
  }

  async update(id: string, updateTourDto: Partial<CreateTourDto>, partner_id: string): Promise<Tour | null> {
    const tour = await this.tourRepository.findOne({ where: { id } });
    if (!tour) return null;
    if (tour.partner_id !== partner_id) {
      throw new ForbiddenException('You can only update your own tours');
    }
    await this.tourRepository.update(id, updateTourDto as any);
    return this.findOne(id);
  }

  async updateAvailability(id: string, availability: any[], partner_id: string): Promise<Tour | null> {
    const tour = await this.tourRepository.findOne({ where: { id } });
    if (!tour) return null;
    if (tour.partner_id !== partner_id) {
      throw new ForbiddenException('You can only update availability of your own tours');
    }
    
    // Валидация данных доступности
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
      .select('DISTINCT tour.city', 'city')
      .where('tour.city IS NOT NULL')
      .andWhere('tour.status = :status', { status: 'active' })
      .orderBy('tour.city', 'ASC')
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
}
