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

    // В реальном приложении здесь будет интеграция с SMS-сервисом
    console.log(`SMS OTP to ${phone}: ${code}`);
    return code;
  }

  async verifySmsOTP(phone: string, code: string, storedCode: string): Promise<boolean> {
    // В реальном приложении здесь будет проверка через SMS-сервис
    return code === storedCode;
  }
}