import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { OtpService } from './services/otp.service';
import { RequestCodeDto } from './dto/request-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { CompletePartnerProfileDto } from './dto/complete-partner-profile.dto';
import { VerifyPhoneDto } from './dto/verify-phone.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {}

  async requestCode(dto: RequestCodeDto) {
    if (dto.type === 'customer') {
      const user = await this.usersService.findByEmail(dto.email);
      if (!user) {
        await this.usersService.createCustomer({ email: dto.email });
      }
      await this.otpService.generateOTP(dto.email);
      return { message: 'Code sent to email' };
    }
    if (dto.type === 'partner') {
      const user = await this.usersService.findByEmail(dto.email);
      if (!user) {
        await this.usersService.createCustomer({ email: dto.email });
      }
      await this.otpService.generateOTP(dto.email);
      return { message: 'Code sent to email' };
    }
    throw new BadRequestException('Unknown user type');
  }

  async verifyCode(dto: VerifyCodeDto) {
    const isValid = await this.otpService.verifyOTP(dto.email, dto.code);
    if (!isValid) throw new UnauthorizedException('Invalid code');
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('User not found');
    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
      await this.usersService.markEmailAsVerified(user.email);
    }
    if (dto.type === 'customer') {
      return this.issueJwt(user);
    }
    if (dto.type === 'partner') {
      if (user.partner && user.partner.phone && user.partner.isPhoneVerified) {
        return this.issueJwt(user);
      } else {
        return {
          status: 'need_profile_completion'
        };
      }
    }
    throw new BadRequestException('Unknown user type');
  }

  async completePartnerProfile(dto: CompletePartnerProfileDto) {
    const partner = await this.usersService.updatePartnerProfile(dto);
    await this.otpService.generateSmsOTP(dto.phone);
    return { message: 'Profile completed, SMS sent' };
  }

  async verifyPhone(dto: VerifyPhoneDto) {
    const isValid = await this.otpService.verifySmsOTP(dto.phone, dto.smsCode);
    if (!isValid) throw new UnauthorizedException('Invalid SMS code');
    await this.usersService.verifyPartnerPhoneByEmailAndPhone(
      dto.email,
      dto.phone,
    );
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('User not found');
    return this.issueJwt(user);
  }

  private issueJwt(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      isEmailVerified: user.isEmailVerified,
      type: user.partner ? 'partner' : 'customer',
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        type: user.partner ? 'partner' : 'customer',
      },
    };
  }
}
