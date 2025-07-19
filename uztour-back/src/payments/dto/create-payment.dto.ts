import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsString, IsOptional, IsEnum, IsBoolean, IsArray, ValidateNested, Min, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod, Currency } from '../entities/payment.entity';

export class UserDataDto {
  @ApiProperty({
    description: 'Уникальный идентификатор пользователя в системе',
    example: 'user-123',
    minLength: 1
  })
  @IsString()
  userId!: string;

  @ApiProperty({
    description: 'Номер телефона пользователя в международном формате',
    example: '+998901234567',
    pattern: '^\\+[1-9]\\d{1,14}$'
  })
  @IsString()
  phone!: string;

  @ApiProperty({
    description: 'Email адрес пользователя',
    example: 'user@example.com',
    format: 'email'
  })
  @IsString()
  email!: string;
}

export class BasketItemDto {
  @ApiProperty({
    description: 'Название позиции в чеке (товар или услуга)',
    example: 'Экскурсия по Самарканду',
    maxLength: 255
  })
  @IsString()
  positionDesc!: string;

  @ApiProperty({
    description: 'Количество единиц товара или услуги',
    example: 2,
    minimum: 1,
    maximum: 100
  })
  @IsNumber()
  @Min(1)
  count!: number;

  @ApiProperty({
    description: 'Цена одной единицы в сумах',
    example: 50000.00,
    minimum: 0,
    maximum: 10000000
  })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiPropertyOptional({
    description: 'Дополнительная информация о позиции (тип билета, возрастная категория и т.д.)',
    example: 'Взрослый билет',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  spic?: string;
}

export class PaymentMethodDto {
  @ApiProperty({
    description: 'Метод оплаты, поддерживаемый OCTO',
    enum: PaymentMethod,
    example: PaymentMethod.BANK_CARD
  })
  @IsEnum(PaymentMethod)
  method!: PaymentMethod;
}

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Уникальный идентификатор бронирования для оплаты',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID()
  bookingId!: string;

  @ApiPropertyOptional({
    description: 'Предпочтительный метод оплаты. Если не указан, пользователь сможет выбрать из доступных методов на странице оплаты OCTO.',
    enum: PaymentMethod,
    example: PaymentMethod.BANK_CARD
  })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional({
    description: 'Одностадийная оплата (true) или двухстадийная (false). При одностадийной оплате средства списываются сразу, при двухстадийной - сначала блокируются, затем списываются.',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  autoCapture?: boolean = true;

  @ApiPropertyOptional({
    description: 'Флаг тестового платежа. В тестовом режиме реальные деньги не списываются.',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  test?: boolean = true;

  @ApiPropertyOptional({
    description: 'Язык платежной формы OCTO',
    example: 'ru',
    enum: ['oz', 'uz', 'en', 'ru'],
    default: 'ru'
  })
  @IsOptional()
  @IsString()
  language?: string = 'ru';

  @ApiPropertyOptional({
    description: 'Время жизни платежа в минутах. По истечении этого времени платеж автоматически отменяется.',
    example: 15,
    minimum: 1,
    maximum: 1440,
    default: 15
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  ttl?: number = 15;

  @ApiPropertyOptional({
    description: 'URL для возврата пользователя после завершения оплаты',
    example: 'http://localhost:3000/payment/success',
    format: 'uri',
    default: 'http://localhost:3000/payment/success'
  })
  @IsOptional()
  @IsUrl()
  returnUrl?: string = 'http://localhost:3000/payment/success';

  @ApiPropertyOptional({
    description: 'URL для получения уведомлений об изменении статуса платежа от OCTO',
    example: 'http://localhost:3000/payments/notify',
    format: 'uri',
    default: 'http://localhost:3000/payments/notify'
  })
  @IsOptional()
  @IsUrl()
  notifyUrl?: string = 'http://localhost:3000/payments/notify';

  @ApiPropertyOptional({
    description: 'Информация о пользователе для передачи в OCTO',
    type: UserDataDto
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserDataDto)
  userData?: UserDataDto;

  @ApiPropertyOptional({
    description: 'Детализированная корзина товаров или услуг. Если не указана, будет создана автоматически на основе данных бронирования.',
    type: [BasketItemDto],
    maxItems: 10
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BasketItemDto)
  basket?: BasketItemDto[];

  @ApiPropertyOptional({
    description: 'Список доступных методов оплаты. Если не указан, будут доступны все методы, поддерживаемые OCTO.',
    type: [PaymentMethodDto],
    maxItems: 5
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentMethodDto)
  paymentMethods?: PaymentMethodDto[];

  @ApiPropertyOptional({
    description: 'Валюта платежа',
    enum: Currency,
    example: Currency.UZS,
    default: Currency.UZS
  })
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency = Currency.UZS;
} 