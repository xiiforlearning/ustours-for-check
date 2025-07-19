import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyPhoneDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsPhoneNumber()
  phone!: string;

  @ApiProperty()
  @IsString()
  smsCode!: string;
} 