import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum PartnerType {
  INDIVIDUAL = 'individual',
  COMPANY = 'company',
}

@Entity()
export class Partner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  phone: string;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column({
    type: 'enum',
    enum: PartnerType,
  })
  partnerType: PartnerType;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  companyName: string;

  @Column('text', { array: true, nullable: true })
  spokenLanguages: string[];

  @Column('text', { array: true, nullable: true })
  certificates: string[];

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'int', nullable: true })
  yearsOfExperience: number;

  @Column({ type: 'text', nullable: true })
  about: string;

  @Column({ nullable: true })
  whatsapp: string;

  @Column({ nullable: true })
  telegram: string;

  @OneToOne(() => User, user => user.partner, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;
}