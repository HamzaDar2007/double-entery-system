import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TrialBalanceService } from '../services/trial-balance.service';
import { IncomeStatementService } from '../services/income-statement.service';
import { BalanceSheetService } from '../services/balance-sheet.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentCompany } from '../../../common/decorators/current-company.decorator';

@Controller('reports/financial')
@UseGuards(JwtAuthGuard)
export class FinancialStatementsController {
  constructor(
    private readonly trialBalanceService: TrialBalanceService,
    private readonly incomeStatementService: IncomeStatementService,
    private readonly balanceSheetService: BalanceSheetService,
  ) {}

  @Get('trial-balance')
  async getTrialBalance(
    @CurrentCompany() companyId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('detailed') detailed?: boolean,
  ) {
    return this.trialBalanceService.generateTrialBalance(
      companyId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      detailed,
    );
  }

  @Get('income-statement')
  async getIncomeStatement(
    @CurrentCompany() companyId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.incomeStatementService.generateIncomeStatement(
      companyId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('balance-sheet')
  async getBalanceSheet(
    @CurrentCompany() companyId: string,
    @Query('asOfDate') asOfDate: string,
  ) {
    return this.balanceSheetService.generateBalanceSheet(
      companyId,
      new Date(asOfDate),
    );
  }
}
