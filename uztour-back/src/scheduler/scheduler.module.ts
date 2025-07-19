import { Module, forwardRef } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SchedulerService } from './scheduler.service';
import { BookingExpirationProcessor } from './booking-expiration.processor';
import { SchedulerController } from './scheduler.controller';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get('REDISCLOUD_URL') || configService.get('REDIS_URL');
        
        if (redisUrl) {
          const url = new URL(redisUrl);
          return {
            redis: {
              host: url.hostname,
              port: parseInt(url.port),
              password: url.password,
              tls: url.protocol === 'rediss:' ? {} : undefined,
            },
          };
        }
        
        return {
          redis: {
            host: configService.get('REDIS_HOST', 'localhost'),
            port: configService.get('REDIS_PORT', 6379),
          },
        };
      },
    }),
    BullModule.registerQueue({
      name: 'booking-expiration',
    }),
    forwardRef(() => BookingsModule),
  ],
  controllers: [SchedulerController],
  providers: [SchedulerService, BookingExpirationProcessor],
  exports: [SchedulerService],
})
export class SchedulerModule {} 