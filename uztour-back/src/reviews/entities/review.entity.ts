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
  id!: string;

  @Column('text')
  content!: string;

  @Column('int')
  rating!: number;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Tour)
  tour!: Tour;

  @CreateDateColumn()
  createdAt!: Date;
}
