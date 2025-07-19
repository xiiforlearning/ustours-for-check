import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Customer } from './entities/customer.entity';
import { Partner, PartnerType } from './entities/partner.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreatePartnerDto } from './dto/create-partner.dto';
import * as bcrypt from 'bcrypt';
import { CompletePartnerProfileDto } from '../auth/dto/complete-partner-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
    
    @InjectRepository(Partner)
    private partnersRepository: Repository<Partner>,
  ) {}

  async createCustomer(createCustomerDto: CreateCustomerDto): Promise<{ user: User; customer: Customer }> {
    const existingUser = await this.usersRepository.findOne({ where: { email: createCustomerDto.email } });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const user = this.usersRepository.create({
      email: createCustomerDto.email
    });
    await this.usersRepository.save(user);
    
    const customer = this.customersRepository.create({
      user
    });
    await this.customersRepository.save(customer);
    
    user.customer = customer;
    await this.usersRepository.save(user);
    
    return { user, customer };
  }

  async createPartner(createPartnerDto: CreatePartnerDto): Promise<{ user: User; partner: Partner }> {
    const existingEmail = await this.usersRepository.findOne({ where: { email: createPartnerDto.email } });
    if (existingEmail) {
      throw new ConflictException('Email already in use');
    }

    const existingPhone = await this.partnersRepository.findOne({ where: { phone: createPartnerDto.phone } });
    if (existingPhone) {
      throw new ConflictException('Phone number already in use');
    }

    const user = this.usersRepository.create({
      email: createPartnerDto.email,
      isEmailVerified: true
    });
    await this.usersRepository.save(user);
    
    const partner = this.partnersRepository.create({
      phone: createPartnerDto.phone,
      partnerType: createPartnerDto.partnerType,
      firstName: createPartnerDto.firstName,
      lastName: createPartnerDto.lastName,
      companyName: createPartnerDto.companyName,
      spokenLanguages: createPartnerDto.spokenLanguages ?? [],
      certificates: createPartnerDto.certificates ?? [],
      avatar: createPartnerDto.avatar ?? '',
      yearsOfExperience: createPartnerDto.yearsOfExperience ?? undefined,
      about: createPartnerDto.about ?? '',
      whatsapp: createPartnerDto.whatsapp ?? '',
      telegram: createPartnerDto.telegram ?? '',
      user
    });
    await this.partnersRepository.save(partner);
    
    user.partner = partner;
    await this.usersRepository.save(user);
    
    return { user, partner };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { email },
      relations: ['customer', 'partner']
    });
  }

  async verifyPartnerPhone(partnerId: string): Promise<Partner> {
    const partner = await this.partnersRepository.findOne({ where: { id: partnerId } });
    if (!partner) {
      throw new Error('Partner not found');
    }
    partner.isPhoneVerified = true;
    return this.partnersRepository.save(partner);
  }

  async updatePartnerProfile(dto: CompletePartnerProfileDto): Promise<Partner> {
    const user = await this.usersRepository.findOne({ where: { email: dto.email }, relations: ['partner'] });
    if (!user) throw new Error('User not found');
    let partner = user.partner;
    if (!partner) {
      partner = this.partnersRepository.create({
        phone: dto.phone!,
        firstName: dto.firstName!,
        lastName: dto.lastName!,
        partnerType: dto.partnerType === 'company' ? PartnerType.COMPANY : PartnerType.INDIVIDUAL,
        companyName: dto.companyName ?? '',
        user,
      });
      await this.partnersRepository.save(partner);
      user.partner = partner;
      await this.usersRepository.save(user);
    } else {
      partner.phone = dto.phone!;
      partner.firstName = dto.firstName!;
      partner.lastName = dto.lastName!;
      partner.partnerType = dto.partnerType === 'company' ? PartnerType.COMPANY : PartnerType.INDIVIDUAL;
      partner.companyName = dto.companyName ?? '';
      await this.partnersRepository.save(partner);
    }
    return partner;
  }

  async verifyPartnerPhoneByEmailAndPhone(email: string, phone: string): Promise<Partner> {
    const user = await this.usersRepository.findOne({ where: { email }, relations: ['partner'] });
    if (!user || !user.partner) throw new Error('Partner not found');
    const partner = user.partner;
    if (partner.phone !== phone) throw new Error('Phone does not match');
    partner.isPhoneVerified = true;
    await this.partnersRepository.save(partner);
    return partner;
  }

  async markEmailAsVerified(email: string): Promise<void> {
    await this.usersRepository.update({ email }, { isEmailVerified: true });
  }

  async updateUser(userId: string, updateDto: any): Promise<User> {
    const allowedFields = ['email', 'isEmailVerified'];
    const updateData: any = {};
    for (const key of allowedFields) {
      if (updateDto[key] !== undefined) {
        updateData[key] = updateDto[key];
      }
    }
    if (updateData.email !== undefined) {
      updateData.isEmailVerified = false;
    }
    await this.usersRepository.update({ id: userId }, updateData);
    const updatedUser = await this.usersRepository.findOne({ where: { id: userId }, relations: ['customer', 'partner'] });
    if (!updatedUser) throw new Error('User not found after update');
    return updatedUser;
  }

  async updatePartnerFields(partnerId: string, updateDto: any): Promise<Partner> {
    const partner = await this.partnersRepository.findOne({ where: { id: partnerId } });
    if (!partner) throw new Error('Partner not found');
    const allowedFields = [
      'avatar', 'certificates', 'spokenLanguages', 'about', 'yearsOfExperience', 'whatsapp', 'telegram',
      'firstName', 'lastName', 'phone', 'companyName'
    ];
    for (const key of allowedFields) {
      if (updateDto[key] !== undefined) {
        partner[key] = updateDto[key];
      }
    }
    await this.partnersRepository.save(partner);
    return partner;
  }

  async findPartnerByUserId(userId: string): Promise<Partner | null> {
    const user = await this.usersRepository.findOne({ 
      where: { id: userId },
      relations: ['partner']
    });
    
    if (!user || !user.partner) {
      return null;
    }
    
    return user.partner;
  }

  async findUserWithPartner(userId: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { id: userId },
      relations: ['partner']
    });
  }
}