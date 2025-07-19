import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsString, IsOptional, IsDateString, Min, Max, IsArray, ValidateNested, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

export class BookingPersonDto {
  @ApiProperty({
    description: 'Имя участника тура',
    example: 'Иван',
    minLength: 1,
    maxLength: 50
  })
  @IsString()
  firstName!: string;

  @ApiProperty({
    description: 'Фамилия участника тура',
    example: 'Иванов',
    minLength: 1,
    maxLength: 50
  })
  @IsString()
  lastName!: string;

  @ApiPropertyOptional({
    description: 'Дата рождения участника в формате YYYY-MM-DD. Требуется для некоторых туров.',
    example: '1990-01-01',
    format: 'date'
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({
    description: 'Номер паспорта участника. Требуется для международных туров и некоторых внутренних туров.',
    example: 'AA1234567',
    pattern: '^[A-Z]{2}\\d{7}$'
  })
  @IsOptional()
  @IsString()
  passportNumber?: string;
}

export class CreateBookingDto {
  @ApiProperty({
    description: 'Уникальный идентификатор тура для бронирования',
    example: '881d9cbe-272b-4ad1-9c0b-e701870691b1',
    format: 'uuid'
  })
  @IsUUID()
  tourId!: string;

  @ApiProperty({
    description: 'Дата проведения тура в формате YYYY-MM-DD. Должна быть в будущем относительно текущей даты.',
    example: '2024-07-15',
    format: 'date'
  })
  @IsDateString()
  tourDate!: string;

  @ApiProperty({
    description: 'Количество взрослых участников (от 18 лет)',
    example: 2,
    minimum: 1,
    maximum: 50
  })
  @IsNumber()
  @Min(1)
  adultsCount!: number;

  @ApiPropertyOptional({
    description: 'Количество детей (от 3 до 17 лет). Дети до 3 лет считаются младенцами.',
    example: 1,
    minimum: 0,
    maximum: 20,
    default: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  childrenCount?: number;

  @ApiPropertyOptional({
    description: 'Количество младенцев (до 3 лет). Обычно не требуют отдельного билета.',
    example: 0,
    minimum: 0,
    maximum: 10,
    default: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  infantsCount?: number;

  @ApiPropertyOptional({
    description: 'Специальные требования или пожелания (диетические ограничения, доступность, дополнительные услуги и т.д.)',
    example: 'Нужен детский стул и безглютеновое меню',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  specialRequirements?: string;

  @ApiProperty({
    description: 'ФИО контактного лица для связи по бронированию',
    example: 'Иван Иванов',
    minLength: 2,
    maxLength: 100
  })
  @IsString()
  contactFullname!: string;

  @ApiPropertyOptional({
    description: 'Контакт WhatsApp для связи',
    example: '+998901234567'
  })
  @IsOptional()
  @IsString()
  whatsapp?: string;

  @ApiPropertyOptional({
    description: 'Контакт Telegram для связи',
    example: '@ivanivanov'
  })
  @IsOptional()
  @IsString()
  telegram?: string;

  @ApiPropertyOptional({
    description: 'Контактный телефон для связи по вопросам бронирования',
    example: '+998901234567',
    pattern: '^\\+[1-9]\\d{1,14}$'
  })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({
    description: 'Email адрес для отправки подтверждения бронирования и важной информации о туре',
    example: 'user@example.com',
    format: 'email'
  })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional({
    description: 'Код валюты, в которой рассчитана стоимость бронирования (например, USD, EUR, RUB, UZS, RMB)',
    example: 'USD',
    maxLength: 3
  })
  @IsOptional()
  @IsString()
  currencyCode?: string;

  @ApiPropertyOptional({
    description: 'Курс валюты по отношению к UZS на момент бронирования',
    example: 12500.5
  })
  @IsOptional()
  @IsNumber()
  currencyRate?: number;
} 