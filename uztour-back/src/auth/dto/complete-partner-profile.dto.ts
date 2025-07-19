import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompletePartnerProfileDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsPhoneNumber()
  phone!: string;

  @ApiProperty()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ enum: ['individual', 'company'] })
  @IsEnum(['individual', 'company'])
  partnerType!: 'individual' | 'company';

  @ApiProperty({ required: false })
  @ValidateIf(o => o.partnerType === 'company')
  @IsNotEmpty()
  companyName?: string;
} 