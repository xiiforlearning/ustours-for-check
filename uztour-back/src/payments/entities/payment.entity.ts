import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../users/entities/user.entity';
import { Booking } from '../../bookings/entities/booking.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string; // 'USD', 'EUR', 'RUB'

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column()
  paymentMethod: string; // 'card', 'paypal', 'crypto'

  @Column({ nullable: true })
  transactionId: string; // ID от платежного шлюза

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>; // Дополнительные данные от платежной системы

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Booking, { onDelete: 'CASCADE' })
  booking: Booking;

  @CreateDateColumn()
  createdAt: Date;
}
