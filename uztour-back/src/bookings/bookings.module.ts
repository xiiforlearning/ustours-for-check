import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking } from './entities/booking.entity';
import { User } from '../users/entities/user.entity';
import { Payment } from '../payments/entities/payment.entity';
import { ToursModule } from '../tours/tours.module';
import { UsersModule } from '../users/users.module';
import { SchedulerModule } from '../scheduler/scheduler.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, User, Payment]), 
    ToursModule, 
    UsersModule, 
    forwardRef(() => SchedulerModule),
    PaymentsModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
