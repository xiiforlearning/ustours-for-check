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

  async generateOTP(email: string, langHeader?: string): Promise<void> {
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    await this.otpRepository.delete({ email });

    const otp = this.otpRepository.create({
      email,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await this.otpRepository.save(otp);

    // Определяем язык из заголовка
    let lang: 'ru' | 'en' | 'uz' | 'zh' = 'ru';
    if (langHeader) {
      const l = langHeader.toLowerCase().split(',')[0].split('-')[0];
      if (l === 'en') lang = 'en';
      else if (l === 'uz') lang = 'uz';
      else if (l === 'zh' || l === 'cn') lang = 'zh';
      else if (l === 'ru') lang = 'ru';
    }

    const { subject, html } = getOtpEmailTemplate(code, lang);
    await this.mailerService.sendMail({
      to: email,
      subject,
      html,
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

    await this.otpRepository.delete({ id: otp.id });
    return true;
  }

  async generateSmsOTP(phone: string): Promise<void> {
    const code = '1111';
    console.log(`SMS OTP to ${phone}: ${code}`);
  }

  async verifySmsOTP(phone: string, code: string): Promise<boolean> {
    return code === '1111';
  }
}

function getOtpEmailTemplate(code: string, lang: 'ru' | 'en' | 'uz' | 'zh' = 'ru') {
  const texts = {
    ru: {
      subject: 'Ваш код подтверждения',
      hello: 'Здравствуйте!',
      yourCode: 'Ваш код подтверждения:',
      valid: 'Код действителен 10 минут.',
      ignore: 'Если вы не запрашивали этот код, просто проигнорируйте это письмо.',
      auto: 'Это автоматическое письмо, не отвечайте на него.',
    },
    en: {
      subject: 'Your Verification Code',
      hello: 'Hello!',
      yourCode: 'Your verification code:',
      valid: 'This code will expire in 10 minutes.',
      ignore: "If you didn't request this code, please ignore this email.",
      auto: 'This is an automated message, please do not reply.',
    },
    uz: {
      subject: 'Tasdiqlash kodi',
      hello: 'Salom!',
      yourCode: 'Sizning tasdiqlash kodingiz:',
      valid: 'Kod 10 daqiqa davomida amal qiladi.',
      ignore: 'Agar siz bu kodni so‘ramagan bo‘lsangiz, iltimos, bu xatni e’tiborsiz qoldiring.',
      auto: 'Bu avtomatik xabar, iltimos, javob bermang.',
    },
    zh: {
      subject: '您的验证码',
      hello: '您好！',
      yourCode: '您的验证码：',
      valid: '验证码10分钟内有效。',
      ignore: '如果您没有请求此验证码，请忽略此邮件。',
      auto: '此为系统自动发送邮件，请勿回复。',
    }
  }[lang];

  return {
    subject: texts.subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 12px #0001; padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #328AEE; margin: 0; font-size: 28px; letter-spacing: 1px;">UzTours</h2>
        </div>
        <p style="font-size: 16px; color: #222; margin-bottom: 16px;">${texts.hello}</p>
        <p style="font-size: 16px; color: #222; margin-bottom: 16px;">${texts.yourCode}</p>
        <div style="background: #f4f8fb; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
          <span style="color: #328AEE; font-size: 40px; font-weight: bold; letter-spacing: 8px;">${code}</span>
        </div>
        <p style="font-size: 15px; color: #555; margin-bottom: 8px;">${texts.valid}</p>
        <p style="font-size: 13px; color: #888; margin-bottom: 0;">${texts.ignore}</p>
        <hr style="margin: 32px 0 16px 0; border: none; border-top: 1px solid #eee;">
        <div style="text-align: center; color: #bbb; font-size: 12px;">${texts.auto}</div>
      </div>
    `
  };
} 