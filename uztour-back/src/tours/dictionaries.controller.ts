import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ToursService } from './tours.service';

@ApiTags('Dictionaries - Справочники')
@Controller('dictionaries')
export class DictionariesController {
  constructor(private readonly toursService: ToursService) {}

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

  @Get('tour-types')
  @ApiOperation({ 
    summary: 'Получить типы туров', 
    description: 'Возвращает список всех доступных типов туров' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список типов туров получен успешно',
    schema: {
      example: ['individual', 'group', 'private']
    }
  })
  async getTourTypes() {
    return ['individual', 'group', 'private'];
  }

  @Get('difficulties')
  @ApiOperation({ 
    summary: 'Получить уровни сложности', 
    description: 'Возвращает список всех уровней сложности туров' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список уровней сложности получен успешно',
    schema: {
      example: ['easy', 'medium', 'hard']
    }
  })
  async getDifficulties() {
    return ['easy', 'medium', 'hard'];
  }

  @Get('duration-units')
  @ApiOperation({ 
    summary: 'Получить единицы измерения длительности', 
    description: 'Возвращает список единиц измерения длительности туров' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список единиц измерения получен успешно',
    schema: {
      example: ['hours', 'days', 'weeks']
    }
  })
  async getDurationUnits() {
    return ['hours', 'days', 'weeks'];
  }

  @Get('currencies')
  @ApiOperation({ 
    summary: 'Получить доступные валюты', 
    description: 'Возвращает список всех поддерживаемых валют' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список валют получен успешно',
    schema: {
      example: ['USD', 'EUR', 'RUB', 'UZS', 'RMB']
    }
  })
  async getCurrencies() {
    return ['USD', 'EUR', 'RUB', 'UZS', 'RMB'];
  }

  @Get('tour-statuses')
  @ApiOperation({ 
    summary: 'Получить статусы туров', 
    description: 'Возвращает список всех возможных статусов туров' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список статусов получен успешно',
    schema: {
      example: ['not_complete', 'active', 'suspended', 'moderation', 'rejected']
    }
  })
  async getTourStatuses() {
    return ['not_complete', 'active', 'suspended', 'moderation', 'rejected'];
  }
} 