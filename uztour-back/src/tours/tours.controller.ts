import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { TourFiltersDto } from './dto/tour-filters.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { CurrencyService } from '../currency/currency.service';

@ApiTags('Tours - Управление турами')
@Controller('tours')
export class ToursController {
  constructor(
    private readonly toursService: ToursService,
    private readonly usersService: UsersService,
    private readonly currencyService: CurrencyService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Создать новый тур', 
    description: 'Создаёт новый тур. Можно создать как черновик (status=not_complete) с минимальными данными, так и полноценный тур. Partner ID автоматически подставляется из JWT токена.' 
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title'],
      properties: {
        title: { 
          type: 'string', 
          example: 'Экскурсия по Самарканду', 
          maxLength: 40,
          description: 'Название тура (обязательно)'
        },
        status: { 
          type: 'string', 
          enum: ['not_complete', 'active', 'suspended', 'moderation', 'rejected'], 
          example: 'not_complete', 
          description: 'Статус тура. not_complete - черновик'
        }
      },
      example: {
        title: 'Экскурсия по Самарканду',
        status: 'not_complete'
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Тур успешно создан'
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Партнёр не найден' })
  async create(@Req() req, @Body() createTourDto: Omit<CreateTourDto, 'partner_id'>) {
    const userId = req.user.sub || req.user.id;
    if (!userId) {
      throw new BadRequestException('User ID not found in JWT');
    }
    return this.toursService.create(createTourDto, userId);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Получить список туров с фильтрами', 
    description: 'Возвращает список активных туров с возможностью фильтрации по городу, дате, типу, языкам, цене, длительности, сложности. Поддерживает сортировку и пагинацию.' 
  })
  @ApiQuery({ 
    name: 'partner_id', 
    required: false, 
    type: String,
    description: 'ID партнёра для фильтрации туров (опционально)'
  })
  @ApiQuery({ 
    name: 'city', 
    required: false, 
    type: String,
    description: 'Город для поиска туров'
  })
  @ApiQuery({ 
    name: 'date', 
    required: false, 
    type: String,
    description: 'Дата начала тура (YYYY-MM-DD)'
  })
  @ApiQuery({ 
    name: 'type', 
    required: false, 
    enum: ['individual', 'group', 'private'],
    description: 'Тип экскурсии'
  })
  @ApiQuery({ 
    name: 'languages', 
    required: false, 
    type: [String],
    description: 'Языки гида (можно передать несколько)'
  })
  @ApiQuery({ 
    name: 'minPrice', 
    required: false, 
    type: Number,
    description: 'Минимальная цена'
  })
  @ApiQuery({ 
    name: 'maxPrice', 
    required: false, 
    type: Number,
    description: 'Максимальная цена'
  })
  @ApiQuery({ 
    name: 'minDuration', 
    required: false, 
    type: Number,
    description: 'Минимальная длительность (в часах)'
  })
  @ApiQuery({ 
    name: 'maxDuration', 
    required: false, 
    type: Number,
    description: 'Максимальная длительность (в часах)'
  })
  @ApiQuery({ 
    name: 'difficulty', 
    required: false, 
    enum: ['easy', 'medium', 'hard'],
    description: 'Сложность тура'
  })
  @ApiQuery({ 
    name: 'sortBy', 
    required: false, 
    enum: ['price', 'rating', 'created_at', 'popularity'],
    description: 'Поле для сортировки'
  })
  @ApiQuery({ 
    name: 'sortOrder', 
    required: false, 
    enum: ['ASC', 'DESC'],
    description: 'Порядок сортировки'
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    type: Number,
    description: 'Номер страницы (начиная с 1)'
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: Number,
    description: 'Количество элементов на странице'
  })
  @ApiQuery({
    name: 'currency',
    required: false,
    type: String,
    description: 'Код валюты для пересчёта цен (например, USD, EUR, RUB, UZS)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список туров получен успешно',
    schema: {
      example: {
        tours: [{
          id: '881d9cbe-272b-4ad1-9c0b-e701870691b1',
          title: 'Экскурсия по Самарканду',
          status: 'active',
          price: 150.00,
          city: 'Самарканд',
          duration: 4,
          type: 'group',
          languages: ['Русский', 'Английский'],
          partner: {
            id: '4ecb3686-41e1-4686-9978-c499ea2ff965',
            firstName: 'Test',
            lastName: 'Partner',
            phone: '+998901234567'
          }
        }],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1
      }
    }
  })
  async findAll(
    @Query() filters: TourFiltersDto,
    @Query('partner_id') partner_id?: string,
    @Query('currency') currency?: string
  ) {
    return this.toursService.findAll(filters, partner_id, currency);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Получить тур по ID', 
    description: 'Возвращает подробную информацию о туре по его уникальному идентификатору. Включает полную информацию о партнёре.' 
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    description: 'Уникальный идентификатор тура (UUID)',
    example: '881d9cbe-272b-4ad1-9c0b-e701870691b1'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Тур найден и возвращён',
    schema: {
      example: {
        id: '881d9cbe-272b-4ad1-9c0b-e701870691b1',
        title: 'Экскурсия по Самарканду',
        status: 'active',
        price: 150.00,
        description: 'Увлекательная экскурсия по древнему городу',
        partner: {
          id: '4ecb3686-41e1-4686-9978-c499ea2ff965',
          firstName: 'Test',
          lastName: 'Partner'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Тур с указанным ID не найден' 
  })
  async findOne(@Param('id') id: string) {
    return this.toursService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Обновить тур', 
    description: 'Обновляет информацию о туре. Только автор тура (партнёр) может обновлять свой тур. Можно передавать только те поля, которые нужно изменить.' 
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    description: 'Уникальный идентификатор тура для обновления',
    example: '881d9cbe-272b-4ad1-9c0b-e701870691b1'
  })
  @ApiBody({ 
    type: CreateTourDto,
    description: 'Поля для обновления (можно передавать только нужные поля)',
    schema: {
      example: {
        title: 'Обновлённое название тура',
        description: 'Новое описание тура',
        price: 200.00,
        status: 'active'
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Тур успешно обновлен',
    schema: {
      example: {
        id: '881d9cbe-272b-4ad1-9c0b-e701870691b1',
        title: 'Обновлённое название тура',
        status: 'active',
        updated_at: '2024-06-28T08:15:30.405Z'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Не авторизован - требуется JWT токен' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Нет прав на обновление этого тура - можно обновлять только свои туры' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Тур с указанным ID не найден' 
  })
  async update(@Req() req, @Param('id') id: string, @Body() updateTourDto: Partial<CreateTourDto>) {
    const userId = req.user.sub || req.user.id;
    if (!userId) {
      throw new BadRequestException('User ID not found in JWT');
    }
    return this.toursService.update(id, updateTourDto, userId);
  }

  @Patch(':id/availability')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Обновить доступность тура', 
    description: 'Обновляет информацию о доступности мест по датам. Только автор тура может изменять доступность. available_slots не может быть больше total_slots.' 
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    description: 'Уникальный идентификатор тура',
    example: '881d9cbe-272b-4ad1-9c0b-e701870691b1'
  })
  @ApiBody({ 
    schema: {
      type: 'object',
      required: ['availability'],
      properties: {
        availability: {
          type: 'array',
          description: 'Массив с информацией о доступности по датам',
          items: {
            type: 'object',
            required: ['date', 'total_slots', 'available_slots'],
            properties: {
              date: { 
                type: 'string', 
                format: 'date', 
                example: '2024-07-05',
                description: 'Дата в формате YYYY-MM-DD'
              },
              total_slots: { 
                type: 'number', 
                example: 10,
                description: 'Общее количество мест на эту дату'
              },
              available_slots: { 
                type: 'number', 
                example: 5,
                description: 'Количество свободных мест на эту дату (не больше total_slots)'
              }
            }
          }
        }
      },
      example: {
        availability: [
          { date: '2024-07-05', total_slots: 10, available_slots: 1 },
          { date: '2024-07-06', total_slots: 10, available_slots: 4 },
          { date: '2024-07-07', total_slots: 10, available_slots: 10 }
        ]
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Доступность тура успешно обновлена',
    schema: {
      example: {
        id: '881d9cbe-272b-4ad1-9c0b-e701870691b1',
        availability: [
          { date: '2024-07-05', total_slots: 10, available_slots: 1 },
          { date: '2024-07-06', total_slots: 10, available_slots: 4 }
        ]
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Неверные данные доступности (available_slots > total_slots или отрицательное значение)' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Не авторизован - требуется JWT токен' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Нет прав на обновление этого тура - можно обновлять только свои туры' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Тур с указанным ID не найден' 
  })
  async updateAvailability(@Req() req, @Param('id') id: string, @Body() updateDto: { availability: any[] }) {
    const userId = req.user.sub || req.user.id;
    if (!userId) {
      throw new BadRequestException('User ID not found in JWT');
    }
    return this.toursService.updateAvailability(id, updateDto.availability, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Удалить тур',
    description: 'Удаляет тур по ID. Только автор тура (партнёр) может удалить свой тур.'
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Уникальный идентификатор тура для удаления',
    example: '881d9cbe-272b-4ad1-9c0b-e701870691b1'
  })
  @ApiResponse({ status: 204, description: 'Тур успешно удалён' })
  @ApiResponse({ status: 401, description: 'Не авторизован - требуется JWT токен' })
  @ApiResponse({ status: 403, description: 'Нет прав на удаление этого тура - можно удалять только свои туры' })
  @ApiResponse({ status: 404, description: 'Тур с указанным ID не найден' })
  async remove(@Req() req, @Param('id') id: string) {
    const userId = req.user.sub || req.user.id;
    if (!userId) {
      throw new BadRequestException('User ID not found in JWT');
    }
    await this.toursService.remove(id, userId);
  }

  @Get('popular')
  @ApiOperation({ 
    summary: 'Получить популярные туры', 
    description: 'Возвращает список самых популярных туров, отсортированных по количеству бронирований' 
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: Number,
    description: 'Количество туров (по умолчанию 10)',
    example: 5
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Популярные туры получены успешно',
    schema: {
      example: [{
        id: '881d9cbe-272b-4ad1-9c0b-e701870691b1',
        title: 'Экскурсия по Самарканду',
        status: 'active',
        price: 150.00,
        rating: 4.8,
        bookingCount: 25,
        partner: {
          id: '4ecb3686-41e1-4686-9978-c499ea2ff965',
          firstName: 'Test',
          lastName: 'Partner'
        }
      }]
    }
  })
  async getPopularTours(@Query('limit') limit: number = 10) {
    return this.toursService.getPopularTours(limit);
  }

  @Get('cities')
  @ApiOperation({ 
    summary: 'Получить список городов', 
    description: 'Возвращает список всех городов, где есть туры' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список городов получен успешно',
    schema: {
      example: ['Самарканд', 'Бухара', 'Ташкент', 'Хива']
    }
  })
  async getCities() {
    return this.toursService.getCities();
  }

  @Get('languages')
  @ApiOperation({ 
    summary: 'Получить список языков', 
    description: 'Возвращает список всех языков, на которых проводятся туры' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список языков получен успешно',
    schema: {
      example: ['Русский', 'Английский', 'Узбекский', 'Немецкий']
    }
  })
  async getLanguages() {
    return this.toursService.getLanguages();
  }

  @Get(':id/price')
  async getTourPrice(@Param('id') id: string, @Query('currency') currency: string = 'UZS') {
    return this.toursService.getTourPrice(id, currency);
  }
}
