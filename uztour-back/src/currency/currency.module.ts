import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyRate } from './entities/currency-rate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyRate])],
  providers: [CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {} 