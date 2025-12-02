import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceCalculationProcessor } from './balance-calculation.processor';
import { RecurringInvoicesProcessor } from './recurring-invoices.processor';
import { JournalEntryLine } from '../modules/vouchers/entities/journal-entry-line.entity';
import { Account } from '../modules/accounts/entities/account.entity';
import { Invoice } from '../modules/invoices/entities/invoice.entity';
import { InvoicesModule } from '../modules/invoices/invoices.module';

import { PeriodClosingProcessor } from './period-closing.processor';
import { ReportGenerationProcessor } from './report-generation.processor';
import { BackupProcessor } from './backup.processor';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'balance-calculation' },
      { name: 'recurring-invoices' },
      { name: 'report-generation' },
      { name: 'period-closing' },
      { name: 'backup' },
    ),
    TypeOrmModule.forFeature([JournalEntryLine, Account, Invoice]),
    InvoicesModule,
  ],
  providers: [
    BalanceCalculationProcessor,
    RecurringInvoicesProcessor,
    PeriodClosingProcessor,
    ReportGenerationProcessor,
    BackupProcessor,
  ],
  exports: [BullModule],
})
export class JobsModule {}
