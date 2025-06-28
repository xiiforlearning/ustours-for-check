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
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column('text')
  content: string;

  @Column('int')
  rating: number; // 1-5

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Tour, (tour) => tour.reviews)
  tour: Tour;

  @CreateDateColumn()
  createdAt: Date;
}
