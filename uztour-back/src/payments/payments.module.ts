import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { OctoService } from './services/octo.service';
import { Payment } from './entities/payment.entity';
import { BookingsModule } from '../bookings/bookings.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]), 
    forwardRef(() => BookingsModule), 
    UsersModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, OctoService],
  exports: [PaymentsService, OctoService],
})
export class PaymentsModule {}
