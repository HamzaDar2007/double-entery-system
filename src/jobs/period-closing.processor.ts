import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';

@Processor('period-closing')
export class PeriodClosingProcessor {
  @Process('close-period')
  async handlePeriodClosing(job: Job) {
    console.log('Processing period closing...', job.data);
    // Logic for period closing
    return { status: 'completed' };
  }
}
