import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../users/entities/user.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  BANK_CARD = 'bank_card',
  UZCARD = 'uzcard',
  HUMO = 'humo',
}

export enum Currency {
  UZS = 'UZS',
  USD = 'USD',
  EUR = 'EUR',
  CNY = 'CNY',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount!: number;

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.UZS,
  })
  currency!: Currency;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status!: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    nullable: true,
  })
  paymentMethod?: PaymentMethod;

  @Column({ nullable: true })
  shopTransactionId?: string; // Уникальный ID транзакции на нашей стороне

  @Column({ nullable: true })
  octoTransactionId?: string; // ID транзакции от OCTO

  @Column({ nullable: true })
  description?: string;

  @Column('jsonb', { nullable: true })
  userData?: {
    userId: string;
    phone: string;
    email: string;
  };

  @Column('jsonb', { nullable: true })
  basket?: Array<{
    positionDesc: string;
    count: number;
    price: number;
    spic?: string;
  }>;

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @Column({ nullable: true })
  returnUrl?: string;

  @Column({ nullable: true })
  notifyUrl?: string;

  @Column({ nullable: true })
  language?: string; // 'oz', 'uz', 'en', 'ru'

  @Column({ nullable: true })
  ttl?: number; // Время жизни платежа в минутах

  @Column({ nullable: true })
  test?: boolean; // Тестовый платеж или нет

  @Column({ nullable: true })
  autoCapture?: boolean; // Одностадийная или двухстадийная оплата

  @Column({ nullable: true })
  initTime?: Date; // Время создания платежа

  @Column({ nullable: true })
  processedAt?: Date; // Время обработки платежа

  @Column({ nullable: true })
  failedAt?: Date; // Время неудачной обработки

  @Column({ nullable: true })
  failureReason?: string; // Причина неудачи

  @ApiPropertyOptional({
    description: 'Код валюты платежа (например, USD, EUR, RUB, UZS, RMB)',
    example: 'USD',
    maxLength: 3
  })
  @Column({ length: 3, nullable: true })
  currency_code?: string;

  @ApiPropertyOptional({
    description: 'Курс валюты по отношению к UZS на момент платежа',
    example: 12500.5
  })
  @Column('float', { nullable: true })
  currency_rate?: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ nullable: true })
  user_id?: string;

  @ManyToOne(() => Booking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'booking_id' })
  booking?: Booking;

  @Column({ nullable: true })
  booking_id?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
