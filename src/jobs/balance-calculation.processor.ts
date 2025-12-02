import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JournalEntryLine } from '../modules/vouchers/entities/journal-entry-line.entity';
import { Account } from '../modules/accounts/entities/account.entity';
import Decimal from 'decimal.js';

@Injectable()
@Processor('balance-calculation')
export class BalanceCalculationProcessor {
  private readonly logger = new Logger(BalanceCalculationProcessor.name);

  constructor(
    @InjectRepository(JournalEntryLine)
    private readonly journalEntryLineRepository: Repository<JournalEntryLine>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  @Process('calculate-balances')
  async handleBalanceCalculation(job: Job) {
    this.logger.log(`Processing balance calculation for company: ${job.data.companyId}`);

    const accounts = await this.accountRepository.find({
      where: { companyId: job.data.companyId },
    });

    for (const account of accounts) {
      await this.calculateAccountBalance(account.id, job.data.companyId);
    }

    this.logger.log(`Completed balance calculation for company: ${job.data.companyId}`);
    return { success: true, accountsProcessed: accounts.length };
  }

  private async calculateAccountBalance(accountId: string, companyId: string): Promise<void> {
    const lines = await this.journalEntryLineRepository
      .createQueryBuilder('line')
      .leftJoin('line.journalEntry', 'entry')
      .where('line.account_id = :accountId', { accountId })
      .andWhere('entry.company_id = :companyId', { companyId })
      .andWhere('entry.status = :status', { status: 'posted' })
      .getMany();

    let debit = new Decimal(0);
    let credit = new Decimal(0);

    lines.forEach((line) => {
      debit = debit.plus(line.debit);
      credit = credit.plus(line.credit);
    });

    const balance = debit.minus(credit);

    // Update account balance (would need to add balance field to Account entity)
    this.logger.debug(`Account ${accountId} balance: ${balance.toString()}`);
  }
}
