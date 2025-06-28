import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestCodeDto {
  @ApiProperty({ description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: ['customer', 'partner'], description: 'User type' })
  @IsEnum(['customer', 'partner'])
  type: 'customer' | 'partner';

  @ApiProperty({ required: false, description: 'Phone number (for partner)' })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({ required: false, description: 'First name (for partner)' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false, description: 'Last name (for partner)' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false, description: 'Partner type (individual/company)' })
  @IsOptional()
  @IsString()
  partnerType?: 'individual' | 'company';

  @ApiProperty({ required: false, description: 'Company name (for company partner)' })
  @IsOptional()
  @IsString()
  companyName?: string;
} 