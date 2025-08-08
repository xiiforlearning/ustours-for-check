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
  title!: string;

  @ApiProperty({ maxLength: 500 })
  @IsString()
  @MaxLength(500)
  description!: string;

  @ApiProperty({ type: [String], maxItems: 4 })
  @IsArray()
  @IsString({ each: true })
  photos!: string[];
}

export class RoutePointDto {
  @ApiProperty()
  @IsNumber()
  lat!: number;

  @ApiProperty()
  @IsNumber()
  lng!: number;

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
  date!: string;

  @ApiProperty({ description: 'Общее количество мест на эту дату' })
  @IsNumber()
  total_slots!: number;

  @ApiProperty({ description: 'Количество свободных мест на эту дату' })
  @IsNumber()
  available_slots!: number;
}

export class CreateTourDto {
  @ApiProperty()
  @IsUUID()
  partner_id!: string;

  @ApiProperty({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  title!: string;

  @ApiProperty({ type: [String], minItems: 1, required: false, nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  photos?: string[] | null;

  @ApiProperty({ type: [String], required: false, nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  city?: string[] | null;

  @ApiProperty({ enum: TourStatus, description: 'Статус тура. not_complete — черновик, можно сохранить незаполненный тур.', required: false, nullable: true })
  @IsEnum(TourStatus)
  @IsOptional()
  status?: TourStatus | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsNumber()
  rating?: number | null;

  @ApiProperty({ maxLength: 700, required: false, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(700)
  description?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsNumber()
  duration?: number | null;

  @ApiProperty({ enum: DurationUnit, required: false, nullable: true })
  @IsOptional()
  @IsEnum(DurationUnit)
  duration_unit?: DurationUnit | null;

  @ApiProperty({ enum: TourType, required: false, nullable: true })
  @IsOptional()
  @IsEnum(TourType)
  type?: TourType | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsNumber()
  min_persons?: number | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsNumber()
  max_persons?: number | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  departure?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsNumber()
  price?: number | null;

  @ApiProperty({ required: false, nullable: true, description: 'Цена для групповых туров' })
  @IsOptional()
  @IsNumber()
  group_price?: number | undefined;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  currency?: string | null;

  @ApiProperty({ type: [String], minItems: 1, required: false, nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  languages?: string[] | null;

  @ApiProperty({ enum: Difficulty, required: false, nullable: true })
  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty | null;

  @ApiProperty({ pattern: '^\\d{2}:\\d{2}$', required: false, nullable: true })
  @IsOptional()
  @IsString()
  departure_time?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsNumber()
  child_price?: number | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  rejection_reason?: string | null;

  @ApiProperty({ required: false, type: [TourDayDto], nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TourDayDto)
  days?: TourDayDto[] | null;

  @ApiProperty({ required: false, type: [String], nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  included?: string[] | null;

  @ApiProperty({ required: false, type: [String], nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excluded?: string[] | null;

  @ApiProperty({ required: false, type: [RoutePointDto], nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoutePointDto)
  route_points?: RoutePointDto[] | null;

  @ApiProperty({ type: [String], minItems: 1, description: 'Available dates in ISO format', required: false, nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsDateString()
  available_dates?: string[] | null;

  @ApiProperty({ maxLength: 255, description: 'Main photo URL or path', required: false, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  main_photo?: string | null;

  @ApiProperty({ maxLength: 100, description: 'City from which the tour departs', required: false, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  departure_city?: string | null;

  @ApiProperty({ type: [AvailabilityDto], description: 'Доступность тура по датам', required: false, nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilityDto)
  availability?: AvailabilityDto[] | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  created_at?: Date | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  updated_at?: Date | null;

  @ApiProperty({ required: false, nullable: true, description: 'Широта отправления' })
  @IsOptional()
  @IsNumber()
  departure_lat?: number | null;

  @ApiProperty({ required: false, nullable: true, description: 'Долгота отправления' })
  @IsOptional()
  @IsNumber()
  departure_lng?: number | null;

  @ApiProperty({ required: false, nullable: true, description: 'Адрес отправления' })
  @IsOptional()
  @IsString()
  departure_address?: string | null;

  @ApiProperty({ required: false, nullable: true, description: 'Ориентир отправления' })
  @IsOptional()
  @IsString()
  departure_landmark?: string | null;
} 