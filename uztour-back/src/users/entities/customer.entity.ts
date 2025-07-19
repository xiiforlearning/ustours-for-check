import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @OneToOne(() => User, user => user.customer, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;
}