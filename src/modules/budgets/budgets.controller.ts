import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentCompany } from '../../common/decorators/current-company.decorator';

@Controller('budgets')
@UseGuards(JwtAuthGuard)
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) { }

  @Post()
  create(@Body() body: any, @CurrentCompany() companyId: string) {
    return this.budgetsService.create(body, companyId);
  }

  @Get()
  findAll(@Query('accountId') accountId: string, @Query('fiscalYearId') fiscalYearId: string, @CurrentCompany() companyId: string) {
    if (accountId && fiscalYearId) {
      return this.budgetsService.findByAccount(accountId, fiscalYearId, companyId);
    }
    return this.budgetsService.findAll(companyId);
  }
}
