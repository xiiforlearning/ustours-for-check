import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Customer } from '../../users/entities/customer.entity';
import { Tour } from '../../tours/entities/tour.entity';
import { BookingStatus } from '../dto/create-booking.dto';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer!: Customer;

  @Column('uuid')
  customer_id!: string;

  @ManyToOne(() => Tour, (tour) => tour.bookings)
  @JoinColumn({ name: 'tour_id' })
  tour!: Tour;

  @Column('uuid')
  tour_id!: string;

  @Column('date')
  tour_date!: Date;

  @Column('int')
  adults_count!: number;

  @Column('int', { default: 0 })
  children_count!: number;

  @Column('boolean', { default: false })
  isGroup!: boolean;

  @Column('decimal', { precision: 10, scale: 2 })
  total_price!: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  adult_price?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  child_price?: number;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status!: BookingStatus;

  @Column('text', { nullable: true })
  special_requirements?: string;

  @Column({ nullable: false })
  contact_fullname!: string;

  @Column({ nullable: true })
  whatsapp?: string;

  @Column({ nullable: true })
  telegram?: string;

  @Column({ nullable: true })
  contact_phone?: string;

  @Column({ nullable: true })
  contact_email?: string;

  @Column('text', { nullable: true })
  cancellation_reason?: string;

  @Column('timestamp', { nullable: true })
  confirmed_at?: Date;

  @Column('timestamp', { nullable: true })
  cancelled_at?: Date;

  @Column('timestamp', { nullable: true })
  completed_at?: Date;

  @Column({ length: 3 })
  currency_code!: string;

  @Column('float')
  currency_rate!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
