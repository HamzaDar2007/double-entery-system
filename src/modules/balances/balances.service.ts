import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountBalance } from './entities/account-balance.entity';

@Injectable()
export class BalancesService {
  constructor(
    @InjectRepository(AccountBalance)
    private balancesRepository: Repository<AccountBalance>,
  ) {}

  async calculateBalances(fiscalYearId: string) {
    // Logic to calculate balances from Journal Entries
    // This is a placeholder for the actual implementation
    return { message: 'Balance calculation triggered' };
  }

  async getBalance(accountId: string, fiscalYearId: string) {
    return this.balancesRepository.findOne({
      where: { accountId, fiscalYearId },
    });
  }
}
