import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Payments - Управление платежами')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Создать платеж для бронирования', 
    description: 'Создает новый платеж через OCTO для оплаты бронирования. Генерирует уникальный ID транзакции, подготавливает платеж в OCTO и возвращает URL для оплаты. Платеж автоматически привязывается к бронированию и пользователю.' 
  })
  @ApiBody({ 
    type: CreatePaymentDto,
    description: 'Данные для создания платежа',
    examples: {
      simple: {
        summary: 'Простой платеж',
        value: {
          bookingId: '123e4567-e89b-12d3-a456-426614174000',
          paymentMethod: 'bank_card',
          test: true
        }
      },
      detailed: {
        summary: 'Детальный платеж с корзиной',
        value: {
          bookingId: '123e4567-e89b-12d3-a456-426614174000',
          paymentMethod: 'uzcard',
          autoCapture: true,
          test: true,
          language: 'ru',
          ttl: 15,
          returnUrl: 'http://localhost:3000/payment/success',
          userData: {
            userId: 'user-123',
            phone: '+998901234567',
            email: 'user@example.com'
          },
          basket: [
            {
              positionDesc: 'Экскурсия по Самарканду',
              count: 2,
              price: 75000.00,
              spic: 'Взрослый билет'
            },
            {
              positionDesc: 'Экскурсия по Самарканду',
              count: 1,
              price: 50000.00,
              spic: 'Детский билет'
            }
          ],
          paymentMethods: [
            { method: 'bank_card' },
            { method: 'uzcard' },
            { method: 'humo' }
          ]
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Платеж успешно создан',
    schema: {
      example: {
        payment: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          amount: 150000.00,
          currency: 'UZS',
          status: 'processing',
          shopTransactionId: 'booking-123_1234567890_abc123',
          description: 'Оплата бронирования тура: Экскурсия по Самарканду',
          octoTransactionId: 'octo-transaction-456',
          createdAt: '2024-06-28T10:30:00.000Z'
        },
        paymentUrl: 'https://secure.octo.uz/payment/transaction-123'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Неверные данные или бронирование уже оплачено',
    schema: {
      example: {
        statusCode: 400,
        message: 'Для этого бронирования уже создан активный платеж',
        error: 'Bad Request'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Не авторизован',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Бронирование не найдено',
    schema: {
      example: {
        statusCode: 404,
        message: 'Бронирование не найдено',
        error: 'Not Found'
      }
    }
  })
  async createPayment(@Req() req, @Body() createPaymentDto: CreatePaymentDto) {
    const userId = req.user.sub || req.user.id;
    if (!userId) {
      throw new BadRequestException('User ID not found in JWT');
    }
    return this.paymentsService.createPayment(createPaymentDto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Получить список платежей', 
    description: 'Возвращает список платежей пользователя с подробной информацией о каждом платеже, включая связанные бронирования и туры. Поддерживает фильтрацию по статусу и датам.' 
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Фильтр по статусу платежа',
    enum: ['pending', 'processing', 'success', 'failed', 'cancelled', 'refunded'],
    example: 'success'
  })
  @ApiQuery({
    name: 'dateFrom',
    required: false,
    description: 'Фильтр по дате создания (YYYY-MM-DD)',
    example: '2024-06-01'
  })
  @ApiQuery({
    name: 'dateTo',
    required: false,
    description: 'Фильтр по дате создания (YYYY-MM-DD)',
    example: '2024-06-30'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список платежей получен успешно',
    schema: {
      example: [{
        id: '123e4567-e89b-12d3-a456-426614174000',
        amount: 150000.00,
        currency: 'UZS',
        status: 'success',
        description: 'Оплата бронирования тура: Экскурсия по Самарканду',
        shopTransactionId: 'booking-123_1234567890_abc123',
        octoTransactionId: 'octo-transaction-456',
        processedAt: '2024-06-28T10:35:00.000Z',
        createdAt: '2024-06-28T10:30:00.000Z',
        booking: {
          id: 'booking-123',
          tour_date: '2024-07-15',
          total_price: 150000.00,
          status: 'confirmed'
        },
        user: {
          id: 'user-123',
          email: 'user@example.com'
        }
      }]
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Не авторизован' 
  })
  async findAll(@Req() req) {
    const userId = req.user.sub || req.user.id;
    if (!userId) {
      throw new BadRequestException('User ID not found in JWT');
    }
    return this.paymentsService.findAll(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Получить платеж по ID', 
    description: 'Возвращает подробную информацию о платеже, включая все детали транзакции, связанное бронирование, тур и пользователя. Пользователи могут видеть только свои платежи.' 
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    description: 'Уникальный идентификатор платежа (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Платеж найден и возвращен',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        amount: 150000.00,
        currency: 'UZS',
        status: 'success',
        description: 'Оплата бронирования тура: Экскурсия по Самарканду',
        shopTransactionId: 'booking-123_1234567890_abc123',
        octoTransactionId: 'octo-transaction-456',
        paymentMethod: 'uzcard',
        userData: {
          userId: 'user-123',
          phone: '+998901234567',
          email: 'user@example.com'
        },
        basket: [
          {
            positionDesc: 'Экскурсия по Самарканду',
            count: 2,
            price: 75000.00,
            spic: 'Взрослый билет'
          }
        ],
        processedAt: '2024-06-28T10:35:00.000Z',
        createdAt: '2024-06-28T10:30:00.000Z',
        booking: {
          id: 'booking-123',
          tour_date: '2024-07-15',
          total_price: 150000.00,
          status: 'confirmed',
          tour: {
            id: 'tour-123',
            title: 'Экскурсия по Самарканду',
            price: 75000.00
          }
        },
        user: {
          id: 'user-123',
          email: 'user@example.com',
          firstName: 'Иван',
          lastName: 'Иванов'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Не авторизован' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Нет прав на просмотр этого платежа',
    schema: {
      example: {
        statusCode: 403,
        message: 'Нет прав на просмотр этого платежа',
        error: 'Forbidden'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Платеж с указанным ID не найден',
    schema: {
      example: {
        statusCode: 404,
        message: 'Платеж не найден',
        error: 'Not Found'
      }
    }
  })
  async findOne(@Req() req, @Param('id') id: string) {
    const userId = req.user.sub || req.user.id;
    if (!userId) {
      throw new BadRequestException('User ID not found in JWT');
    }
    return this.paymentsService.findOne(id, userId);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Отменить платеж', 
    description: 'Отменяет активный платеж. Можно отменить только платежи в статусах PENDING или PROCESSING. При отмене платеж переходит в статус CANCELLED.' 
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    description: 'Уникальный идентификатор платежа для отмены',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Платеж успешно отменен',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'cancelled',
        failureReason: 'Отменен пользователем',
        failedAt: '2024-06-28T11:00:00.000Z',
        updatedAt: '2024-06-28T11:00:00.000Z'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Платеж нельзя отменить',
    schema: {
      example: {
        statusCode: 400,
        message: 'Платеж нельзя отменить',
        error: 'Bad Request'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Не авторизован' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Нет прав на отмену этого платежа' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Платеж с указанным ID не найден' 
  })
  async cancelPayment(@Req() req, @Param('id') id: string) {
    const userId = req.user.sub || req.user.id;
    if (!userId) {
      throw new BadRequestException('User ID not found in JWT');
    }
    return this.paymentsService.cancelPayment(id, userId);
  }

  @Post('notify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Webhook для уведомлений от OCTO', 
    description: 'Обрабатывает уведомления об изменении статуса платежа от OCTO. При успешном платеже автоматически подтверждает связанное бронирование и отменяет таймер автоматической отмены. При неудачном платеже обновляет статус платежа и оставляет бронирование в статусе PENDING.' 
  })
  @ApiBody({
    description: 'Уведомление от OCTO',
    schema: {
      type: 'object',
      properties: {
        transaction_id: {
          type: 'string',
          description: 'ID транзакции в OCTO',
          example: 'octo-transaction-456'
        },
        shop_transaction_id: {
          type: 'string',
          description: 'ID транзакции в магазине',
          example: 'booking-123_1234567890_abc123'
        },
        status: {
          type: 'string',
          description: 'Статус платежа',
          enum: ['success', 'failed', 'cancelled'],
          example: 'success'
        },
        amount: {
          type: 'number',
          description: 'Сумма платежа',
          example: 150000.00
        },
        currency: {
          type: 'string',
          description: 'Валюта платежа',
          example: 'UZS'
        },
        description: {
          type: 'string',
          description: 'Описание платежа',
          example: 'Оплата бронирования тура'
        },
        timestamp: {
          type: 'string',
          description: 'Время обработки',
          example: '2024-06-28T10:35:00.000Z'
        },
        signature: {
          type: 'string',
          description: 'Подпись для проверки',
          example: 'abc123def456'
        }
      },
      example: {
        transaction_id: 'octo-transaction-456',
        shop_transaction_id: 'booking-123_1234567890_abc123',
        status: 'success',
        amount: 150000.00,
        currency: 'UZS',
        description: 'Оплата бронирования тура: Экскурсия по Самарканду',
        timestamp: '2024-06-28T10:35:00.000Z',
        signature: 'abc123def456'
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Уведомление обработано успешно',
    schema: {
      example: {
        success: true,
        message: 'Notification processed successfully'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Неверные данные уведомления',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid notification data',
        error: 'Bad Request'
      }
    }
  })
  async processNotification(@Body() notification: any) {
    await this.paymentsService.processNotification(notification);
    return { success: true };
  }

  @Get('stats/summary')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Получить статистику платежей', 
    description: 'Возвращает статистику платежей пользователя, включая количество и общую сумму по каждому статусу. Полезно для аналитики и мониторинга платежной активности.' 
  })
  @ApiQuery({
    name: 'period',
    required: false,
    description: 'Период для статистики',
    enum: ['today', 'week', 'month', 'year', 'all'],
    example: 'month'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Статистика получена успешно',
    schema: {
      example: {
        pending: { 
          count: 2, 
          amount: 300000.00 
        },
        processing: { 
          count: 1, 
          amount: 150000.00 
        },
        success: { 
          count: 5, 
          amount: 750000.00 
        },
        failed: { 
          count: 1, 
          amount: 150000.00 
        },
        cancelled: { 
          count: 1, 
          amount: 150000.00 
        },
        total: {
          count: 10,
          amount: 1500000.00
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Не авторизован' 
  })
  async getPaymentStats(@Req() req) {
    const userId = req.user.sub || req.user.id;
    if (!userId) {
      throw new BadRequestException('User ID not found in JWT');
    }
    return this.paymentsService.getPaymentStats(userId);
  }
}
