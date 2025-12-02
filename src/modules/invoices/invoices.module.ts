import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesService } from './services/invoices.service';
import { InvoiceVoucherService } from './services/invoice-voucher.service';
import { InvoicePdfService } from './services/invoice-pdf.service';
import { InvoicesController } from './invoices.controller';
import { Invoice } from './entities/invoice.entity';
import { InvoiceLine } from './entities/invoice-line.entity';
import { JournalEntry } from '../vouchers/entities/journal-entry.entity';
import { JournalEntryLine } from '../vouchers/entities/journal-entry-line.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Invoice,
      InvoiceLine,
      JournalEntry,
      JournalEntryLine,
    ]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, InvoiceVoucherService, InvoicePdfService],
  exports: [InvoicesService, InvoiceVoucherService, InvoicePdfService],
})
export class InvoicesModule {}
