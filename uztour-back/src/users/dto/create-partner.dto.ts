import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartnerType } from '../entities/partner.entity';

export class CreatePartnerDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsPhoneNumber()
  phone!: string;

  @ApiProperty({ enum: PartnerType })
  @IsEnum(PartnerType)
  partnerType!: PartnerType;

  @ApiProperty({ required: false })
  @ValidateIf(o => o.partnerType === PartnerType.INDIVIDUAL)
  @IsNotEmpty()
  firstName?: string;

  @ApiProperty({ required: false })
  @ValidateIf(o => o.partnerType === PartnerType.INDIVIDUAL)
  @IsNotEmpty()
  lastName?: string;

  @ApiProperty({ required: false })
  @ValidateIf(o => o.partnerType === PartnerType.COMPANY)
  @IsNotEmpty()
  companyName?: string;

  spokenLanguages?: string[];
  certificates?: string[];
  avatar?: string;
  yearsOfExperience?: number;
  about?: string;
  whatsapp?: string;
  telegram?: string;
}