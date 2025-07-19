import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Review } from '../../reviews/entities/review.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { TourStatus, DurationUnit, TourType, Difficulty } from '../dto/create-tour.dto';
import { Partner } from '../../users/entities/partner.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ unique: true })
  name!: string;

  @Column()
  description!: string;

  @OneToMany(() => Tour, (tour) => tour.category)
  tours!: Tour[];
}

@Entity('tours')
export class Tour {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Partner)
  @JoinColumn({ name: 'partner_id' })
  partner!: Partner;

  @Column('uuid')
  partner_id!: string;

  @Column({ length: 100 })
  title!: string;

  @Column('text', { array: true, nullable: true, default: [] })
  photos!: string[];

  @Column('text', { array: true, nullable: true, default: [] })
  city!: string[];

  @Column({ type: 'enum', enum: TourStatus, default: TourStatus.NOT_COMPLETE })
  status!: TourStatus;

  @Column({ type: 'float', nullable: true })
  rating?: number;

  @Column({ length: 700, nullable: true })
  description?: string;

  @Column('int', { nullable: true })
  duration?: number;

  @Column({ type: 'enum', enum: DurationUnit, nullable: true })
  duration_unit?: DurationUnit;

  @Column({ type: 'enum', enum: TourType, nullable: true })
  type?: TourType;

  @Column({ type: 'int', nullable: true })
  min_persons?: number;

  @Column({ type: 'int', nullable: true })
  max_persons?: number;

  @Column({ nullable: true })
  departure?: string;

  @Column('float', { nullable: true })
  price?: number;

  @Column({ nullable: true })
  currency?: string;

  @Column('text', { array: true, nullable: true, default: [] })
  languages!: string[];

  @Column({ type: 'enum', enum: Difficulty, nullable: true })
  difficulty?: Difficulty;

  @Column({ nullable: true })
  departure_time?: string;

  @Column({ type: 'float', nullable: true })
  child_price?: number;

  @Column({ type: 'text', nullable: true })
  rejection_reason?: string;

  @Column('jsonb', { nullable: true, default: [] })
  days!: any[];

  @Column('text', { array: true, nullable: true, default: [] })
  included!: string[];

  @Column('text', { array: true, nullable: true, default: [] })
  excluded!: string[];

  @Column('jsonb', { nullable: true })
  route_points?: any[];

  @Column('text', { array: true, nullable: true, default: [] })
  available_dates!: string[];

  @Column({ length: 255, nullable: true })
  main_photo?: string;

  @Column({ length: 100, nullable: true })
  departure_city?: string;

  @Column('jsonb', { nullable: true, default: [] })
  availability!: any[];

  @Column('float', { nullable: true })
  departure_lat?: number;

  @Column('float', { nullable: true })
  departure_lng?: number;

  @Column({ nullable: true })
  departure_address?: string;

  @Column({ nullable: true })
  departure_landmark?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => Category, (category) => category.tours)
  category!: Category;

  @OneToMany(() => Review, (review) => review.tour)
  reviews!: Review[];

  @OneToMany(() => Booking, (booking) => booking.tour)
  bookings!: Booking[];
}
