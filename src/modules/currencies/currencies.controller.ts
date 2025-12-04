import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentCompany } from '../../common/decorators/current-company.decorator';

@Controller('currencies')
@UseGuards(JwtAuthGuard)
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) { }

  @Get()
  findAll(@CurrentCompany() companyId: string) {
    // Currencies are system-wide, companyId is optional
    return this.currenciesService.findAll();
  }

  @Post()
  create(@Body() body: any, @CurrentCompany() companyId: string) {
    return this.currenciesService.createCurrency(body);
  }

  @Post('rates')
  setRate(@Body() body: any, @CurrentCompany() companyId: string) {
    return this.currenciesService.setExchangeRate(body);
  }
}
