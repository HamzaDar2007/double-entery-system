import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';

@Processor('backup')
export class BackupProcessor {
  @Process('perform-backup')
  async handleBackup(job: Job) {
    console.log('Performing database backup...', job.data);
    // Logic for database backup
    return { status: 'completed' };
  }
}
