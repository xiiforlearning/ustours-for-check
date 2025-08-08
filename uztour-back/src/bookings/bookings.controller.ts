import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@ApiTags('Bookings - Управление бронированиями')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService, private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Создать новое бронирование', 
    description: 'Создаёт новое бронирование тура. Проверяет доступность мест, рассчитывает стоимость и запускает таймер на 30 минут для автоматической отмены, если оплата не подтверждается.' 
  })
  @ApiBody({ 
    type: CreateBookingDto,
    description: 'Данные для создания бронирования',
    examples: {
      example1: {
        summary: 'Бронирование для взрослых',
        value: {
          tourId: '881d9cbe-272b-4ad1-9c0b-e701870691b1',
          tourDate: '2024-07-15',
          adultsCount: 2,
          childrenCount: 0,
          specialRequirements: 'Нужен детский стул',
          contactPhone: '+998901234567',
          contactEmail: 'user@example.com',
          contactFullname: 'Иван Иванов',
          whatsapp: '+998901234567',
          telegram: '@ivan_ivanov'
        }
      },
      example2: {
        summary: 'Семейное бронирование',
        value: {
          tourId: '881d9cbe-272b-4ad1-9c0b-e701870691b1',
          tourDate: '2024-07-20',
          adultsCount: 2,
          childrenCount: 2,
          specialRequirements: 'Нужны детские стулья и коляска',
          contactPhone: '+998901234567',
          contactEmail: 'family@example.com',
          contactFullname: 'Мария Петрова',
          whatsapp: '+998901234568',
          telegram: '@maria_petrova'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Бронирование успешно создано',
    schema: {
      example: {
        booking: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          tour_date: '2024-07-15',
          adults_count: 2,
          children_count: 1,
          infants_count: 0,
          total_price: 450.00,
          status: 'pending',
          created_at: '2024-06-28T10:30:00.000Z',
          tour: {
            id: '881d9cbe-272b-4ad1-9c0b-e701870691b1',
            title: 'Экскурсия по Самарканду',
            price: 150.00
          }
        },
        payment: {
          id: '456e7890-e89b-12d3-a456-426614174001',
          amount: 450.00,
          currency: 'UZS',
          status: 'pending',
          description: 'Оплата бронирования тура: Экскурсия по Самарканду'
        },
        paymentUrl: 'https://octo.uz/pay/1234567890abcdef'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Неверные данные или недостаточно мест',
    schema: {
      example: {
        statusCode: 400,
        message: 'Недостаточно мест на выбранную дату',
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
    description: 'Тур не найден',
    schema: {
      example: {
        statusCode: 404,
        message: 'Тур не найден',
        error: 'Not Found'
      }
    }
  })
  async create(@Req() req, @Body() createBookingDto: CreateBookingDto) {
    const userId = req.user.id;
    if (!userId) {
      throw new BadRequestException('User ID not found in JWT');
    }
    return this.bookingsService.create(createBookingDto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Получить список бронирований', 
    description: 'Возвращает список бронирований пользователя или партнёра. Для партнёров показываются все бронирования их туров. Для пользователей - только их собственные бронирования.' 
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Фильтр по статусу бронирования',
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    example: 'pending'
  })
  @ApiQuery({
    name: 'dateFrom',
    required: false,
    description: 'Фильтр по дате начала (YYYY-MM-DD)',
    example: '2024-07-01'
  })
  @ApiQuery({
    name: 'dateTo',
    required: false,
    description: 'Фильтр по дате окончания (YYYY-MM-DD)',
    example: '2024-07-31'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список бронирований получен успешно',
    schema: {
      example: [{
        id: '123e4567-e89b-12d3-a456-426614174000',
        tour_date: '2024-07-15',
        adults_count: 2,
        children_count: 1,
        total_price: 450.00,
        status: 'confirmed',
        created_at: '2024-06-28T10:30:00.000Z',
        tour: {
          id: '881d9cbe-272b-4ad1-9c0b-e701870691b1',
          title: 'Экскурсия по Самарканду',
          price: 150.00
        },
        user: {
          id: 'user-id',
          firstName: 'Иван',
          lastName: 'Иванов'
        }
      }]
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Не авторизован' 
  })
  async findAll(@Req() req) {
    const userId = req.user.id;
    const userType = req.user.type;
    
    console.log('BookingsController.findAll - userId:', userId, 'userType:', userType);
    
    if (userType === 'partner') {
      // Для партнёра получаем его ID из базы данных
      const partner = await this.usersService.findPartnerByUserId(userId);
      console.log('Found partner:', partner?.id);
      if (partner) {
        console.log('Calling findAll with partnerId:', partner.id);
        return this.bookingsService.findAll(undefined, partner.id);
      } else {
        console.log('Partner not found for userId:', userId);
      }
    }
    
    // Для customer (или если партнёр не найден) получаем только его бронирования
    console.log('Calling findAll with userId:', userId);
    return this.bookingsService.findAll(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Получить бронирование по ID', 
    description: 'Возвращает подробную информацию о бронировании. Пользователи могут видеть только свои бронирования, партнёры - бронирования своих туров.' 
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    description: 'Уникальный идентификатор бронирования (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Бронирование найдено и возвращено',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        tour_date: '2024-07-15',
        adults_count: 2,
        children_count: 1,
        infants_count: 0,
        total_price: 450.00,
        status: 'confirmed',
        special_requirements: 'Нужен детский стул',
        participants: [
          { firstName: 'Иван', lastName: 'Иванов', passportNumber: 'AA1234567' },
          { firstName: 'Мария', lastName: 'Иванова', passportNumber: 'AA1234568' }
        ],
        created_at: '2024-06-28T10:30:00.000Z',
        confirmed_at: '2024-06-28T11:00:00.000Z',
        tour: {
          id: '881d9cbe-272b-4ad1-9c0b-e701870691b1',
          title: 'Экскурсия по Самарканду',
          price: 150.00,
          duration: 8,
          duration_unit: 'hours'
        },
        user: {
          id: 'user-id',
          firstName: 'Иван',
          lastName: 'Иванов',
          email: 'user@example.com'
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
    description: 'Нет прав на просмотр этого бронирования',
    schema: {
      example: {
        statusCode: 403,
        message: 'Нет прав на просмотр этого бронирования',
        error: 'Forbidden'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Бронирование с указанным ID не найдено',
    schema: {
      example: {
        statusCode: 404,
        message: 'Бронирование не найдено',
        error: 'Not Found'
      }
    }
  })
  async findOne(@Req() req, @Param('id') id: string) {
    const userId = req.user.id;
    const userType = req.user.type;
    
    if (userType === 'partner') {
      // Для партнёра получаем его ID из базы данных
      const partner = await this.usersService.findPartnerByUserId(userId);
      if (partner) {
        return this.bookingsService.findOne(id, undefined, partner.id);
      }
    }
    
    // Для customer (или если партнёр не найден) получаем только его бронирование
    return this.bookingsService.findOne(id, userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Обновить статус бронирования', 
    description: 'Обновляет статус бронирования. Только партнёры могут изменять статус бронирований своих туров. При изменении статуса на CONFIRMED отменяется таймер автоматической отмены.' 
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    description: 'Уникальный идентификатор бронирования для обновления',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({ 
    type: UpdateBookingDto,
    description: 'Новый статус бронирования',
    examples: {
      confirm: {
        summary: 'Подтвердить бронирование',
        value: {
          status: 'confirmed',
          comment: 'Бронирование подтверждено'
        }
      },
      cancel: {
        summary: 'Отменить бронирование',
        value: {
          status: 'cancelled',
          comment: 'Отменено по просьбе клиента'
        }
      },
      complete: {
        summary: 'Завершить тур',
        value: {
          status: 'completed',
          comment: 'Тур успешно завершен'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Статус бронирования успешно обновлен',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'confirmed',
        confirmed_at: '2024-06-28T11:00:00.000Z',
        updated_at: '2024-06-28T11:00:00.000Z'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Не авторизован' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Нет прав на обновление этого бронирования',
    schema: {
      example: {
        statusCode: 403,
        message: 'Only partners can update booking status',
        error: 'Forbidden'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Бронирование с указанным ID не найдено' 
  })
  async update(@Req() req, @Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    const userId = req.user.id;
    const userType = req.user.type;
    
    if (userType !== 'partner') {
      throw new BadRequestException('Only partners can update booking status');
    }
    
    // Для партнёра получаем его ID из базы данных
    const partner = await this.usersService.findPartnerByUserId(userId);
    if (!partner) {
      throw new BadRequestException('Partner not found');
    }
    
    return this.bookingsService.update(id, updateBookingDto, partner.id);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Отменить бронирование', 
    description: 'Отменяет бронирование. Пользователи могут отменять только свои бронирования. При отмене возвращаются места в доступность и отменяется таймер автоматической отмены.' 
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    description: 'Уникальный идентификатор бронирования для отмены',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        reason: {
          type: 'string',
          description: 'Причина отмены',
          example: 'Изменение планов'
        }
      },
      example: {
        reason: 'Изменение планов'
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Бронирование успешно отменено',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'cancelled',
        cancelled_at: '2024-06-28T12:00:00.000Z',
        cancellation_reason: 'Изменение планов'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Бронирование нельзя отменить',
    schema: {
      example: {
        statusCode: 400,
        message: 'Бронирование нельзя отменить',
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
    description: 'Нет прав на отмену этого бронирования' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Бронирование с указанным ID не найдено' 
  })
  async cancel(@Req() req, @Param('id') id: string, @Body() body: { reason?: string }) {
    const userId = req.user.id;
    if (!userId) {
      throw new BadRequestException('User ID not found in JWT');
    }
    return this.bookingsService.cancel(id, userId, body.reason);
  }
}
