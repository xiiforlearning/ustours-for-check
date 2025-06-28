import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class OTP {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column()
  email: string;

  @Column()
  code: string; // Зашифрованный OTP

  @Column({ default: false })
  isUsed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp' })
  expiresAt: Date;
}
