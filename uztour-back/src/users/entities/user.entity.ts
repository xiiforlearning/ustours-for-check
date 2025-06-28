import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Customer } from './customer.entity';
import { Partner } from './partner.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => Customer, customer => customer.user, { nullable: true })
  @JoinColumn()
  customer?: Customer;

  @OneToOne(() => Partner, partner => partner.user, { nullable: true })
  @JoinColumn()
  partner?: Partner;
}