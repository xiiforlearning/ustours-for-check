import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsEnum, IsNumber, IsOptional, IsUUID, IsDateString, MaxLength, MinLength, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export enum TourStatus { ACTIVE = 'active', SUSPENDED = 'suspended', MODERATION = 'moderation', REJECTED = 'rejected', NOT_COMPLETE = 'not_complete' }
export enum DurationUnit { HOURS = 'hours', DAYS = 'days', MINUTES = 'minutes' }
export enum TourType { GROUP = 'group', PRIVATE = 'private' }
export enum Difficulty { EASY = 'easy', MEDIUM = 'medium', HARD = 'hard' }

export class TourDayDto {
  @ApiProperty({ maxLength: 50 })
  @IsString()
  @MaxLength(50)
  title: string;

  @ApiProperty({ maxLength: 500 })
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiProperty({ type: [String], maxItems: 4 })
  @IsArray()
  @IsString({ each: true })
  photos: string[];
}

export class RoutePointDto {
  @ApiProperty()
  @IsNumber()
  lat: number;

  @ApiProperty()
  @IsNumber()
  lng: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class AvailabilityDto {
  @ApiProperty({ description: 'Дата в формате YYYY-MM-DD' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Общее количество мест на эту дату' })
  @IsNumber()
  total_slots: number;

  @ApiProperty({ description: 'Количество свободных мест на эту дату' })
  @IsNumber()
  available_slots: number;
}

export class CreateTourDto {
  @ApiProperty()
  @IsUUID()
  partner_id: string;

  @ApiProperty({ maxLength: 40 })
  @IsString()
  @MaxLength(40)
  title: string;

  @ApiProperty({ type: [String], minItems: 1, required: false })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  photos?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ enum: TourStatus, description: 'Статус тура. not_complete — черновик, можно сохранить незаполненный тур.' })
  @IsEnum(TourStatus)
  @IsOptional()
  status: TourStatus = TourStatus.NOT_COMPLETE;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  rating?: number | null;

  @ApiProperty({ maxLength: 700, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(700)
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiProperty({ enum: DurationUnit, required: false })
  @IsOptional()
  @IsEnum(DurationUnit)
  duration_unit?: DurationUnit;

  @ApiProperty({ enum: TourType, required: false })
  @IsOptional()
  @IsEnum(TourType)
  type?: TourType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  min_persons?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  max_persons?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  departure?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ type: [String], minItems: 1, required: false })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  languages?: string[];

  @ApiProperty({ enum: Difficulty, required: false })
  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;

  @ApiProperty({ pattern: '^\\d{2}:\\d{2}$', required: false })
  @IsOptional()
  @IsString()
  departure_time?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  child_price?: number | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  rejection_reason?: string | null;

  @ApiProperty({ required: false, type: [TourDayDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TourDayDto)
  days?: TourDayDto[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  included?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excluded?: string[];

  @ApiProperty({ required: false, type: [RoutePointDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoutePointDto)
  route_points?: RoutePointDto[];

  @ApiProperty({ type: [String], minItems: 1, description: 'Available dates in ISO format', required: false })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsDateString()
  available_dates?: string[];

  @ApiProperty({ maxLength: 255, description: 'Main photo URL or path', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  main_photo?: string;

  @ApiProperty({ maxLength: 100, description: 'City from which the tour departs', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  departure_city?: string;

  @ApiProperty({ type: [AvailabilityDto], description: 'Доступность тура по датам', required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilityDto)
  availability?: AvailabilityDto[];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
} 