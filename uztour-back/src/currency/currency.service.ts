import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrencyRate } from './entities/currency-rate.entity';

@Injectable()
export class CurrencyService implements OnModuleInit {
  private readonly logger = new Logger(CurrencyService.name);

  constructor(
    @InjectRepository(CurrencyRate)
    private readonly currencyRateRepository: Repository<CurrencyRate>,
  ) {}

  async onModuleInit() {
    await this.initCurrencyRates();
  }

  async initCurrencyRates() {
    try {
      const { data } = await axios.get('https://cbu.uz/ru/arkhiv-kursov-valyut/json/');
      const codes = ['USD', 'EUR', 'RUB', 'RMB', 'UZS'];
      for (const code of codes) {
        let rateValue = 1;
        if (code !== 'UZS') {
          const found = data.find((r: any) => r.Ccy === (code === 'RMB' ? 'CNY' : code));
          if (!found) continue;
          rateValue = parseFloat(found.Rate);
        }
        await this.setCurrencyRate(code, rateValue);
      }
      this.logger.log('Currency rates initialized in DB');
    } catch (error) {
      this.logger.error('Failed to initialize currency rates', error);
    }
  }

  async getCurrencyRate(code: string): Promise<CurrencyRate> {
    let rate = await this.currencyRateRepository.findOne({ where: { code } });
    const now = new Date();

    // Если нет в базе или устарел (>1 часа) — обновить
    if (!rate || (rate.updated_at && (now.getTime() - rate.updated_at.getTime()) > 60 * 60 * 1000)) {
      const apiRate = await this.fetchRateFromApi(code);
      if (apiRate !== null) {
        if (!rate) {
          rate = this.currencyRateRepository.create({ code, rate: apiRate });
        } else {
          rate.rate = apiRate;
        }
        await this.currencyRateRepository.save(rate);
      } else if (!rate) {
        this.logger.error(`Currency rate for ${code} not found in DB and not fetched from API`);
        throw new Error(`Currency rate for ${code} not found`);
      }
    }
    return rate!;
  }

  async fetchRateFromApi(code: string): Promise<number | null> {
    if (code === 'UZS') return 1;
    try {
      const { data } = await axios.get('https://cbu.uz/ru/arkhiv-kursov-valyut/json/');
      const found = data.find((r: any) => r.Ccy === code || r.Ccy === (code === 'RMB' ? 'CNY' : code));
      return found ? parseFloat(found.Rate) : null;
    } catch (error) {
      this.logger.error(`Failed to fetch rate for ${code} from API`, error);
      return null;
    }
  }

  async setCurrencyRate(code: string, rateValue: number) {
    let rate = await this.currencyRateRepository.findOne({ where: { code } });
    if (!rate) {
      rate = this.currencyRateRepository.create({ code, rate: rateValue });
    } else {
      rate.rate = rateValue;
    }
    await this.currencyRateRepository.save(rate);
  }
} 