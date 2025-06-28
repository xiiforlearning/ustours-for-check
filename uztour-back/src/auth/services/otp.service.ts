import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OTP } from '../entities/otp.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OTP)
    private otpRepository: Repository<OTP>,
    private mailerService: MailerService,
  ) {}

  async generateOTP(email: string): Promise<void> {
    // Generate a 4-digit OTP using Math.random()
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    // Удаляем старые OTP для этого email
    await this.otpRepository.delete({ email });

    // Создаем новый OTP
    const otp = this.otpRepository.create({
      email,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    await this.otpRepository.save(otp);

    // Отправляем OTP на email
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">UzTours Verification</h2>
          <p>Hello!</p>
          <p>Your verification code is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #328AEE; font-size: 32px; margin: 0; letter-spacing: 5px;">${code}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
        </div>
      `,
    });
  }

  async verifyOTP(email: string, code: string): Promise<boolean> {
    const otp = await this.otpRepository.findOne({
      where: { email, code },
    });

    if (!otp) {
      return false;
    }

    if (otp.expiresAt < new Date()) {
      await this.otpRepository.delete({ id: otp.id });
      return false;
    }

    // Удаляем использованный OTP
    await this.otpRepository.delete({ id: otp.id });
    return true;
  }

  async generateSmsOTP(phone: string): Promise<void> {
    // Хардкодим код для теста
    const code = '1111';
    console.log(`SMS OTP to ${phone}: ${code}`);
  }

  async verifySmsOTP(phone: string, code: string): Promise<boolean> {
    // Хардкодим проверку на 1111
    return code === '1111';
  }
} 