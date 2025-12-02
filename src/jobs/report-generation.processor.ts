import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';

@Processor('report-generation')
export class ReportGenerationProcessor {
  @Process('generate-report')
  async handleReportGeneration(job: Job) {
    console.log('Generating report...', job.data);
    // Logic for report generation
    return { status: 'completed' };
  }
}
