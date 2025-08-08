import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum, IsArray, Min, Max, IsDateString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TourType, Difficulty } from './create-tour.dto';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export enum SortField {
  PRICE = 'price',
  RATING = 'rating',
  CREATED_AT = 'created_at',
  POPULARITY = 'popularity'
}

export class TourFiltersDto {
  @ApiPropertyOptional({
    description: 'Города для поиска туров',
    example: ['Самарканд', 'Бухара'],
    type: [String]
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsString({ each: true })
  city?: string[];

  @ApiPropertyOptional({
    description: 'Дата начала тура (YYYY-MM-DD)',
    example: '2024-07-15'
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({
    description: 'Тип экскурсии',
    enum: TourType,
    example: TourType.GROUP
  })
  @IsOptional()
  @IsEnum(TourType)
  type?: TourType;

  @ApiPropertyOptional({
    description: 'Языки гида (массив)',
    example: ['Русский', 'Английский'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  languages?: string[];

  @ApiPropertyOptional({
    description: 'Минимальная цена',
    example: 100,
    minimum: 0
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Максимальная цена',
    example: 500,
    minimum: 0
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Минимальная длительность (в часах)',
    example: 2,
    minimum: 0
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minDuration?: number;

  @ApiPropertyOptional({
    description: 'Максимальная длительность (в часах)',
    example: 8,
    minimum: 0
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxDuration?: number;

  @ApiPropertyOptional({
    description: 'Сложность тура',
    enum: Difficulty,
    example: Difficulty.EASY
  })
  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;

  @ApiPropertyOptional({
    description: 'Поле для сортировки',
    enum: SortField,
    example: SortField.PRICE
  })
  @IsOptional()
  @IsEnum(SortField)
  sortBy?: SortField = SortField.CREATED_AT;

  @ApiPropertyOptional({
    description: 'Порядок сортировки',
    enum: SortOrder,
    example: SortOrder.DESC
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({
    description: 'Номер страницы (начиная с 1)',
    example: 1,
    minimum: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Количество элементов на странице',
    example: 10,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
} 