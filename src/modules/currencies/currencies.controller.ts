import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('currencies')
@UseGuards(JwtAuthGuard)
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Get()
  findAll() {
    return this.currenciesService.findAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.currenciesService.createCurrency(body);
  }

  @Post('rates')
  setRate(@Body() body: any) {
    return this.currenciesService.setExchangeRate(body);
  }
}
