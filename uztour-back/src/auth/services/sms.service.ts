import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as otpGenerator from 'otp-generator';

@Injectable()
export class SmsService {
  constructor(private configService: ConfigService) {}

  async sendSmsOTP(phone: string): Promise<string> {
    const code = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false
    });

    console.log(`SMS OTP to ${phone}: ${code}`);
    return code;
  }

  async verifySmsOTP(phone: string, code: string, storedCode: string): Promise<boolean> {
    return code === storedCode;
  }
}