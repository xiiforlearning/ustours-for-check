import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../users/entities/user.entity';
import { Tour } from '../../tours/entities/tour.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column('int')
  peopleCount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ default: 'pending' })
  status: string; // pending, confirmed, cancelled

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Tour, (tour) => tour.bookings)
  tour: Tour;

  @CreateDateColumn()
  createdAt: Date;
}
