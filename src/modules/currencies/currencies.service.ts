import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from './entities/currency.entity';
import { ExchangeRate } from './entities/exchange-rate.entity';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(Currency)
    private currenciesRepository: Repository<Currency>,
    @InjectRepository(ExchangeRate)
    private exchangeRatesRepository: Repository<ExchangeRate>,
  ) {}

  async findAll(): Promise<Currency[]> {
    return this.currenciesRepository.find();
  }

  async createCurrency(currencyData: Partial<Currency>): Promise<Currency> {
    const currency = this.currenciesRepository.create(currencyData);
    return this.currenciesRepository.save(currency);
  }

  async setExchangeRate(rateData: Partial<ExchangeRate>): Promise<ExchangeRate> {
    const rate = this.exchangeRatesRepository.create(rateData);
    return this.exchangeRatesRepository.save(rate);
  }
}
