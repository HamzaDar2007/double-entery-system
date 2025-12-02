import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { GeneralLedgerService } from '../services/general-ledger.service';
import { AgingReportService } from '../services/aging-report.service';
import { JournalRegisterService } from '../services/journal-register.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentCompany } from '../../../common/decorators/current-company.decorator';

@Controller('reports/management')
@UseGuards(JwtAuthGuard)
export class ManagementReportsController {
  constructor(
    private readonly generalLedgerService: GeneralLedgerService,
    private readonly agingReportService: AgingReportService,
    private readonly journalRegisterService: JournalRegisterService,
  ) {}

  @Get('general-ledger/:accountId')
  async getGeneralLedger(
    @Param('accountId') accountId: string,
    @CurrentCompany() companyId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.generalLedgerService.generateGeneralLedger(
      accountId,
      companyId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('ar-aging')
  async getARAgingReport(
    @CurrentCompany() companyId: string,
    @Query('asOfDate') asOfDate?: string,
  ) {
    return this.agingReportService.generateARAgingReport(
      companyId,
      asOfDate ? new Date(asOfDate) : new Date(),
    );
  }

  @Get('ap-aging')
  async getAPAgingReport(
    @CurrentCompany() companyId: string,
    @Query('asOfDate') asOfDate?: string,
  ) {
    return this.agingReportService.generateAPAgingReport(
      companyId,
      asOfDate ? new Date(asOfDate) : new Date(),
    );
  }

  @Get('journal-register')
  async getJournalRegister(
    @CurrentCompany() companyId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.journalRegisterService.generateJournalRegister(
      companyId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('day-book')
  async getDayBook(
    @CurrentCompany() companyId: string,
    @Query('date') date: string,
  ) {
    return this.journalRegisterService.generateDayBook(
      companyId,
      new Date(date),
    );
  }
}
