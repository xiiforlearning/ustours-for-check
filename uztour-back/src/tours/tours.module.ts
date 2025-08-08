import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToursController } from './tours.controller';
import { DictionariesController } from './dictionaries.controller';
import { ToursService } from './tours.service';
import { Tour, Category } from './entities/tour.entity';
import { UsersModule } from '../users/users.module';
import { CurrencyModule } from '../currency/currency.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tour, Category]),
    UsersModule,
    CurrencyModule,
  ],
  controllers: [ToursController, DictionariesController],
  providers: [ToursService],
  exports: [ToursService],
})
export class ToursModule {}
