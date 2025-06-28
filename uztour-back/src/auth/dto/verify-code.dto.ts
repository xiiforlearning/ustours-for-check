import { IsEmail, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyCodeDto {
  @ApiProperty({ description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Verification code' })
  @IsString()
  code: string;

  @ApiProperty({ enum: ['customer', 'partner'], description: 'User type' })
  @IsEnum(['customer', 'partner'])
  type: 'customer' | 'partner';
} 