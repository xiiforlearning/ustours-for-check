import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, Unique } from 'typeorm';

@Entity('currency_rates')
@Unique(['code'])
export class CurrencyRate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 3 })
  code!: string; // 'USD', 'EUR', 'RUB', 'UZS', 'RMB'

  @Column('float')
  rate!: number; // Курс к UZS

  @UpdateDateColumn()
  updated_at!: Date;
} 