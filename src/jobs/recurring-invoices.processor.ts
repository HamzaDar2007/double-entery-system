import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../modules/invoices/entities/invoice.entity';
import { InvoicesService } from '../modules/invoices/services/invoices.service';
import { InvoiceStatus } from '../common/enums/invoice-status.enum';

@Injectable()
@Processor('recurring-invoices')
export class RecurringInvoicesProcessor {
  private readonly logger = new Logger(RecurringInvoicesProcessor.name);

  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    private readonly invoicesService: InvoicesService,
  ) {}

  @Process('generate-recurring')
  async handleRecurringInvoices(job: Job) {
    this.logger.log('Processing recurring invoices generation');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const recurringInvoices = await this.invoiceRepository.find({
      where: {
        isRecurring: true,
        status: InvoiceStatus.ISSUED,
      },
    });

    let generated = 0;

    for (const invoice of recurringInvoices) {
      if (invoice.nextInvoiceDate && new Date(invoice.nextInvoiceDate) <= today) {
        try {
          await this.generateNextInvoice(invoice);
          generated++;
        } catch (error) {
          this.logger.error(`Failed to generate recurring invoice ${invoice.id}: ${error.message}`);
        }
      }
    }

    this.logger.log(`Generated ${generated} recurring invoices`);
    return { success: true, generated };
  }

  private async generateNextInvoice(originalInvoice: Invoice): Promise<void> {
    const nextDate = this.calculateNextDate(
      originalInvoice.nextInvoiceDate,
      originalInvoice.recurringFrequency,
    );

    // Create new invoice based on original
    // Implementation would copy invoice details and create new invoice
    
    // Update original invoice's next date
    originalInvoice.nextInvoiceDate = nextDate;
    await this.invoiceRepository.save(originalInvoice);
  }

  private calculateNextDate(currentDate: Date, frequency: string): Date {
    const next = new Date(currentDate);
    
    switch (frequency) {
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'quarterly':
        next.setMonth(next.getMonth() + 3);
        break;
      case 'yearly':
        next.setFullYear(next.getFullYear() + 1);
        break;
    }

    return next;
  }
}
