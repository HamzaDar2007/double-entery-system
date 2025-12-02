import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrialBalanceService } from './services/trial-balance.service';
import { IncomeStatementService } from './services/income-statement.service';
import { BalanceSheetService } from './services/balance-sheet.service';
import { GeneralLedgerService } from './services/general-ledger.service';
import { AgingReportService } from './services/aging-report.service';
import { JournalRegisterService } from './services/journal-register.service';
import { FinancialStatementsController } from './controllers/financial-statements.controller';
import { ManagementReportsController } from './controllers/management-reports.controller';
import { Account } from '../accounts/entities/account.entity';
import { JournalEntry } from '../vouchers/entities/journal-entry.entity';
import { JournalEntryLine } from '../vouchers/entities/journal-entry-line.entity';
import { Invoice } from '../invoices/entities/invoice.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, JournalEntry, JournalEntryLine, Invoice]),
  ],
  controllers: [FinancialStatementsController, ManagementReportsController],
  providers: [
    TrialBalanceService,
    IncomeStatementService,
    BalanceSheetService,
    GeneralLedgerService,
    AgingReportService,
    JournalRegisterService,
  ],
  exports: [
    TrialBalanceService,
    IncomeStatementService,
    BalanceSheetService,
    GeneralLedgerService,
    AgingReportService,
    JournalRegisterService,
  ],
})
export class ReportsModule {}
