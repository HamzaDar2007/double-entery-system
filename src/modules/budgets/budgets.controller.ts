import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('budgets')
@UseGuards(JwtAuthGuard)
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  create(@Body() body: any) {
    return this.budgetsService.create(body);
  }

  @Get()
  findAll(@Query('accountId') accountId?: string, @Query('fiscalYearId') fiscalYearId?: string) {
    if (accountId && fiscalYearId) {
      return this.budgetsService.findByAccount(accountId, fiscalYearId);
    }
    return this.budgetsService.findAll();
  }
}
