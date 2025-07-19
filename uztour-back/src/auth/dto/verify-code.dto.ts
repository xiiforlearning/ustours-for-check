import { IsEmail, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyCodeDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  code!: string;

  @ApiProperty()
  @IsEnum(['customer', 'partner'])
  type!: 'customer' | 'partner';
} 