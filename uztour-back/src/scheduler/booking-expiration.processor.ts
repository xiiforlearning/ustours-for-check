import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { SchedulerService } from './scheduler.service';

@Processor('booking-expiration')
export class BookingExpirationProcessor {
  private readonly logger = new Logger(BookingExpirationProcessor.name);

  constructor(private readonly schedulerService: SchedulerService) {}

  @Process('expire-booking')
  async handleBookingExpiration(job: Job<{ bookingId: string }>): Promise<void> {
    this.logger.log(`Processing booking expiration job ${job.id} for booking ${job.data.bookingId}`);
    
    try {
      await this.schedulerService.handleBookingExpiration(job.data.bookingId);
      this.logger.log(`Successfully processed booking expiration for ${job.data.bookingId}`);
    } catch (error) {
      this.logger.error(`Failed to process booking expiration for ${job.data.bookingId}:`, error);
      throw error;
    }
  }
} 