import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsNumber,
  IsString,
  IsOptional,
  Min,
  IsEmail,
  IsDate,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export class CreateBookingDto {
  @ApiProperty({
    description: 'Уникальный идентификатор тура для бронирования',
    example: '881d9cbe-272b-4ad1-9c0b-e701870691b1',
    format: 'uuid',
  })
  @IsUUID()
  tourId!: string;

  @IsDate()
  @Transform(({ value }) => {
    const parsedDate = new Date(value);
    if (isNaN(parsedDate.getTime())) {
      const parts = value.split('.');
      if (parts.length === 3) {
        const newDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        if (isNaN(newDate.getTime())) {
          throw new BadRequestException('Invalid date format');
        }
        return newDate;
      }
      throw new BadRequestException('Invalid date format');
    }
    if (parsedDate < new Date()) {
      throw new BadRequestException('Tour date must be in the future');
    }
    return parsedDate;
  })
  tourDate!: Date;

  @ApiProperty({
    description: 'Количество взрослых участников (от 18 лет)',
    example: 2,
    minimum: 1,
    maximum: 50,
  })
  @IsNumber()
  @Min(1)
  adultsCount!: number;

  @ApiPropertyOptional({
    description:
      'Количество детей (от 3 до 17 лет). Дети до 3 лет считаются младенцами.',
    example: 1,
    minimum: 0,
    maximum: 20,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  childrenCount?: number;

  @ApiPropertyOptional({
    description: 'Флаг "выкупа" всего тура на день. Для PRIVATE туров - игнорируется (всегда true). Для GROUP туров: true = выкуп всего тура (корпоративы, большие группы), false = присоединение к существующей группе',
    example: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  isGroup?: boolean;

  @ApiPropertyOptional({
    description:
      'Специальные требования или пожелания (диетические ограничения, доступность, дополнительные услуги и т.д.)',
    example: 'Нужен детский стул и безглютеновое меню',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  specialRequirements?: string;

  @ApiProperty({
    description: 'ФИО контактного лица для связи по бронированию',
    example: 'Иван Иванов',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  contactFullname!: string;

  @ApiPropertyOptional({
    description: 'Контакт WhatsApp для связи',
    example: '+998901234567',
  })
  @IsOptional()
  @IsString()
  whatsapp?: string;

  @ApiPropertyOptional({
    description: 'Контакт Telegram для связи',
    example: '@ivanivanov',
  })
  @IsOptional()
  @IsString()
  telegram?: string;

  @ApiPropertyOptional({
    description: 'Контактный телефон для связи по вопросам бронирования',
    example: '+998901234567',
    pattern: '^\\+[1-9]\\d{1,14}$',
  })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({
    description:
      'Email адрес для отправки подтверждения бронирования и важной информации о туре',
    example: 'user@example.com',
    format: 'email',
  })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional({
    description:
      'Код валюты, в которой рассчитана стоимость бронирования (например, USD, EUR, RUB, UZS, RMB)',
    example: 'USD',
    maxLength: 3,
  })
  @IsOptional()
  @IsString()
  currencyCode?: string;

  @ApiPropertyOptional({
    description: 'Курс валюты по отношению к UZS на момент бронирования',
    example: 12500.5,
  })
  @IsOptional()
  @IsNumber()
  currencyRate?: number;
}
