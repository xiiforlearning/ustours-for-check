import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { Payment, PaymentStatus, PaymentMethod } from '../entities/payment.entity';

export interface OctoPreparePaymentRequest {
  octo_shop_id: number;
  octo_secret: string;
  shop_transaction_id: string;
  auto_capture: boolean;
  init_time: string;
  test?: boolean;
  user_data?: {
    user_id: string;
    phone: string;
    email: string;
  };
  total_sum: number;
  currency: string;
  description: string;
  basket?: Array<{
    position_desc: string;
    count: number;
    price: number;
    spic?: string;
  }>;
  payment_methods?: Array<{
    method: string;
  }>;
  tsp_id?: number;
  return_url: string;
  notify_url?: string;
  language: string;
  ttl?: number;
}

export interface OctoPreparePaymentResponse {
  status: number;
  message: string;
  data?: {
    transaction_id: string;
    payment_url: string;
  };
}

export interface OctoNotification {
  transaction_id: string;
  shop_transaction_id: string;
  status: string;
  amount: number;
  currency: string;
  description: string;
  timestamp: string;
  signature?: string;
}

@Injectable()
export class OctoService {
  private readonly logger = new Logger(OctoService.name);
  private readonly octoApiUrl: string;
  private readonly octoShopId: number;
  private readonly octoSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.octoApiUrl = this.configService.get<string>('OCTO_API_URL', 'https://secure.octo.uz');
    this.octoShopId = this.configService.get<number>('OCTO_SHOP_ID') || 0;
    this.octoSecret = this.configService.get<string>('OCTO_SECRET') || '';

    if (!this.octoShopId || !this.octoSecret) {
      this.logger.warn('OCTO credentials not configured. Payments will not work.');
    }
  }

  
  async preparePayment(payment: Payment, createPaymentDto: CreatePaymentDto): Promise<OctoPreparePaymentResponse> {
    if (!this.octoShopId || !this.octoSecret) {
      throw new BadRequestException('OCTO credentials not configured');
    }

    const requestData: OctoPreparePaymentRequest = {
      octo_shop_id: this.octoShopId,
      octo_secret: this.octoSecret,
      shop_transaction_id: payment.shopTransactionId ?? '',
      auto_capture: createPaymentDto.autoCapture ?? true,
      init_time: payment.initTime ? payment.initTime.toISOString().replace('T', ' ').substring(0, 19) : '',
      test: createPaymentDto.test ?? true,
      total_sum: payment.amount,
      currency: payment.currency,
      description: payment.description ?? '',
      return_url: payment.returnUrl ?? '',
      language: createPaymentDto.language ?? 'ru',
      ttl: createPaymentDto.ttl ?? 15,
    };

    if (createPaymentDto.userData) {
      requestData.user_data = {
        user_id: createPaymentDto.userData.userId,
        phone: createPaymentDto.userData.phone,
        email: createPaymentDto.userData.email,
      };
    }

    if (createPaymentDto.basket && createPaymentDto.basket.length > 0) {
      requestData.basket = createPaymentDto.basket.map(item => ({
        position_desc: item.positionDesc,
        count: item.count,
        price: item.price,
        spic: item.spic,
      }));
    }

    if (createPaymentDto.paymentMethods && createPaymentDto.paymentMethods.length > 0) {
      requestData.payment_methods = createPaymentDto.paymentMethods.map(method => ({
        method: method.method,
      }));
    }

    if (payment.notifyUrl) {
      requestData.notify_url = payment.notifyUrl;
    }

    try {
      this.logger.log(`Preparing payment for booking ${payment.booking_id}`);
      
      const response: AxiosResponse<OctoPreparePaymentResponse> = await axios.post(
        `${this.octoApiUrl}/prepare_payment`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      this.logger.log(`Payment prepared successfully: ${response.data.data?.transaction_id}`);

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        // @ts-ignore: axios error может содержать response
        this.logger.error('Error preparing payment with OCTO:', (error as any).response?.data || error.message);
        // @ts-ignore: axios error может содержать response
        if ((error as any).response?.data) {
          throw new BadRequestException(`OCTO Error: ${(error as any).response.data.message || 'Unknown error'}`);
        }
        throw new BadRequestException('Failed to prepare payment with OCTO');
      } else {
        this.logger.error('Error preparing payment with OCTO:', String(error));
        throw new BadRequestException('Failed to prepare payment with OCTO');
      }
    }
  }

  
  verifyNotificationSignature(notification: OctoNotification, signature: string): boolean {
    this.logger.warn('Signature verification not implemented yet');
    return true; // Временно возвращаем true
  }

  
  async processNotification(notification: OctoNotification): Promise<{ success: boolean; message: string }> {
    this.logger.log(`Processing OCTO notification for transaction ${notification.transaction_id}`);

    switch (notification.status.toLowerCase()) {
      case 'success':
      case 'completed':
        return { success: true, message: 'Payment completed successfully' };
      
      case 'failed':
      case 'declined':
        return { success: false, message: 'Payment failed or declined' };
      
      case 'cancelled':
        return { success: false, message: 'Payment was cancelled' };
      
      default:
        this.logger.warn(`Unknown payment status: ${notification.status}`);
        return { success: false, message: `Unknown status: ${notification.status}` };
    }
  }

  
  generateShopTransactionId(bookingId: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${bookingId}_${timestamp}_${random}`;
  }
} 