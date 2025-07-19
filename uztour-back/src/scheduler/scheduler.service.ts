import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BookingsService } from '../bookings/bookings.service';
import { BookingStatus } from '../bookings/dto/create-booking.dto';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    @InjectQueue('booking-expiration') private bookingExpirationQueue: Queue,
    @Inject(forwardRef(() => BookingsService))
    private readonly bookingsService: BookingsService,
  ) {}

  
  async scheduleBookingExpiration(bookingId: string): Promise<void> {
    const delay = 30 * 60 * 1000;
    
    await this.bookingExpirationQueue.add(
      'expire-booking',
      { bookingId },
      { delay }
    );

    this.logger.log(`Scheduled expiration for booking ${bookingId} in 30 minutes`);
  }

  
  async cancelBookingExpiration(bookingId: string): Promise<void> {
    const jobs = await this.bookingExpirationQueue.getJobs(['delayed']);
    const job = jobs.find(j => j.data.bookingId === bookingId);
    
    if (job) {
      await job.remove();
      this.logger.log(`Cancelled expiration for booking ${bookingId}`);
    }
  }

  
  async handleBookingExpiration(bookingId: string): Promise<void> {
    try {
      this.logger.log(`Processing expiration for booking ${bookingId}`);
      
      const booking = await this.bookingsService.findOne(bookingId);
      
      if (booking.status === BookingStatus.PENDING) {
        await this.bookingsService.autoCancel(bookingId, 'Автоматическая отмена: время ожидания оплаты истекло');
        this.logger.log(`Booking ${bookingId} automatically cancelled due to payment timeout`);
      } else {
        this.logger.log(`Booking ${bookingId} is no longer pending, skipping expiration`);
      }
    } catch (error) {
      this.logger.error(`Error processing booking expiration for ${bookingId}:`, error);
    }
  }

  
  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredJobs(): Promise<void> {
    try {
      const jobs = await this.bookingExpirationQueue.getJobs(['delayed']);
      const now = Date.now();
      
      for (const job of jobs) {
        if (job.processedOn && (now - job.processedOn) > 60 * 60 * 1000) {
          await job.remove();
          this.logger.log(`Cleaned up expired job ${job.id}`);
        }
      }
    } catch (error) {
      this.logger.error('Error cleaning up expired jobs:', error);
    }
  }
} 