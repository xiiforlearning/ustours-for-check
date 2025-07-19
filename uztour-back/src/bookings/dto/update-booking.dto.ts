import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { BookingStatus } from './create-booking.dto';

export class UpdateBookingDto {
  @ApiProperty({
    description: 'Новый статус бронирования. При изменении статуса на CONFIRMED автоматически отменяется таймер автоматической отмены.',
    enum: BookingStatus,
    example: BookingStatus.CONFIRMED,
    enumName: 'BookingStatus'
  })
  @IsEnum(BookingStatus)
  status!: BookingStatus;

  @ApiPropertyOptional({
    description: 'Комментарий к изменению статуса. Полезно для отслеживания причин изменений и внутренней коммуникации.',
    example: 'Бронирование подтверждено после успешной оплаты',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;
} 