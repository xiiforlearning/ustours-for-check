import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly botToken: string | undefined;
  private readonly chatId: string | undefined;

  constructor(private configService: ConfigService) {
    this.botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    this.chatId = this.configService.get<string>('TELEGRAM_CHAT_ID');
  }

  async sendNotification(message: string): Promise<void> {
    if (!this.botToken || !this.chatId) {
      this.logger.warn('Telegram bot token or chat ID not configured');
      return;
    }

    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const response = await axios.post(url, {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'HTML'
      });

      if (response.data.ok) {
        this.logger.log('Telegram notification sent successfully');
      } else {
        this.logger.error('Failed to send Telegram notification:', response.data);
      }
    } catch (error) {
      this.logger.error('Error sending Telegram notification:', error instanceof Error ? error.message : String(error));
    }
  }

  async sendBookingNotification(booking: {
    id: string;
    tour: { title: string };
    tour_date: Date | string;
    adults_count: number;
    children_count: number;
    total_price: number;
    currency_code: string;
    contact_fullname: string;
    contact_phone?: string;
    contact_email?: string;
    whatsapp?: string;
    telegram?: string;
    special_requirements?: string;
  }): Promise<void> {
    // Преобразуем дату в строку, если это Date
    const tourDateStr = booking.tour_date instanceof Date 
      ? booking.tour_date.toISOString().split('T')[0]
      : booking.tour_date;

    const message = `
🆕 <b>Новое бронирование!</b>

📋 <b>Детали бронирования:</b>
• ID: <code>${booking.id}</code>
• Тур: ${booking.tour.title}
• Дата: ${tourDateStr}
• Взрослых: ${booking.adults_count}
• Детей: ${booking.children_count}
• Сумма: ${booking.total_price} ${booking.currency_code}

👤 <b>Контактная информация:</b>
• Имя: ${booking.contact_fullname}
${booking.contact_phone ? `• Телефон: ${booking.contact_phone}` : ''}
${booking.contact_email ? `• Email: ${booking.contact_email}` : ''}
${booking.whatsapp ? `• WhatsApp: ${booking.whatsapp}` : ''}
${booking.telegram ? `• Telegram: ${booking.telegram}` : ''}
${booking.special_requirements ? `• Особые требования: ${booking.special_requirements}` : ''}

⏰ Время создания: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' })}
    `.trim();

    await this.sendNotification(message);
  }
} 