import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';
import { JournalEntryLine } from '../../vouchers/entities/journal-entry-line.entity';
import Decimal from 'decimal.js';

export interface TrialBalanceItem {
  accountCode: string;
  accountName: string;
  debit: string;
  credit: string;
  balance: string;
}

@Injectable()
export class TrialBalanceService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(JournalEntryLine)
    private readonly journalEntryLineRepository: Repository<JournalEntryLine>,
  ) {}

  async generateTrialBalance(
    companyId: string,
    startDate?: Date,
    endDate?: Date,
    detailed: boolean = false,
  ): Promise<{ items: TrialBalanceItem[]; totalDebit: string; totalCredit: string }> {
    const accounts = await this.accountRepository.find({
      where: { companyId, isActive: true },
      order: { code: 'ASC' },
    });

    const items: TrialBalanceItem[] = [];
    let totalDebit = new Decimal(0);
    let totalCredit = new Decimal(0);

    for (const account of accounts) {
      const query = this.journalEntryLineRepository
        .createQueryBuilder('line')
        .leftJoin('line.journalEntry', 'entry')
        .where('line.account_id = :accountId', { accountId: account.id })
        .andWhere('entry.company_id = :companyId', { companyId })
        .andWhere('entry.status = :status', { status: 'posted' });

      if (startDate) {
        query.andWhere('entry.entry_date >= :startDate', { startDate });
      }

      if (endDate) {
        query.andWhere('entry.entry_date <= :endDate', { endDate });
      }

      const lines = await query.getMany();

      let accountDebit = new Decimal(0);
      let accountCredit = new Decimal(0);

      lines.forEach((line) => {
        accountDebit = accountDebit.plus(line.debit);
        accountCredit = accountCredit.plus(line.credit);
      });

      const balance = accountDebit.minus(accountCredit);

      if (!balance.isZero() || detailed) {
        items.push({
          accountCode: account.code,
          accountName: account.name,
          debit: accountDebit.toString(),
          credit: accountCredit.toString(),
          balance: balance.toString(),
        });

        totalDebit = totalDebit.plus(accountDebit);
        totalCredit = totalCredit.plus(accountCredit);
      }
    }

    return {
      items,
      totalDebit: totalDebit.toString(),
      totalCredit: totalCredit.toString(),
    };
  }
}
