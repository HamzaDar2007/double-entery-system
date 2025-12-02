import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';
import { JournalEntryLine } from '../../vouchers/entities/journal-entry-line.entity';
import { AccountType } from '../../../common/enums/account-type.enum';
import Decimal from 'decimal.js';

export interface IncomeStatementItem {
  accountCode: string;
  accountName: string;
  amount: string;
}

export interface IncomeStatementReport {
  revenue: IncomeStatementItem[];
  expenses: IncomeStatementItem[];
  totalRevenue: string;
  totalExpenses: string;
  netIncome: string;
}

@Injectable()
export class IncomeStatementService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(JournalEntryLine)
    private readonly journalEntryLineRepository: Repository<JournalEntryLine>,
  ) {}

  async generateIncomeStatement(
    companyId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<IncomeStatementReport> {
    const revenueAccounts = await this.accountRepository.find({
      where: { companyId, type: AccountType.INCOME, isActive: true },
      order: { code: 'ASC' },
    });

    const expenseAccounts = await this.accountRepository.find({
      where: { companyId, type: AccountType.EXPENSE, isActive: true },
      order: { code: 'ASC' },
    });

    const revenue: IncomeStatementItem[] = [];
    let totalRevenue = new Decimal(0);

    for (const account of revenueAccounts) {
      const amount = await this.getAccountBalance(
        account.id,
        companyId,
        startDate,
        endDate,
      );

      if (!amount.isZero()) {
        revenue.push({
          accountCode: account.code,
          accountName: account.name,
          amount: amount.abs().toString(),
        });
        totalRevenue = totalRevenue.plus(amount.abs());
      }
    }

    const expenses: IncomeStatementItem[] = [];
    let totalExpenses = new Decimal(0);

    for (const account of expenseAccounts) {
      const amount = await this.getAccountBalance(
        account.id,
        companyId,
        startDate,
        endDate,
      );

      if (!amount.isZero()) {
        expenses.push({
          accountCode: account.code,
          accountName: account.name,
          amount: amount.abs().toString(),
        });
        totalExpenses = totalExpenses.plus(amount.abs());
      }
    }

    const netIncome = totalRevenue.minus(totalExpenses);

    return {
      revenue,
      expenses,
      totalRevenue: totalRevenue.toString(),
      totalExpenses: totalExpenses.toString(),
      netIncome: netIncome.toString(),
    };
  }

  private async getAccountBalance(
    accountId: string,
    companyId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Decimal> {
    const lines = await this.journalEntryLineRepository
      .createQueryBuilder('line')
      .leftJoin('line.journalEntry', 'entry')
      .where('line.account_id = :accountId', { accountId })
      .andWhere('entry.company_id = :companyId', { companyId })
      .andWhere('entry.status = :status', { status: 'posted' })
      .andWhere('entry.entry_date >= :startDate', { startDate })
      .andWhere('entry.entry_date <= :endDate', { endDate })
      .getMany();

    let debit = new Decimal(0);
    let credit = new Decimal(0);

    lines.forEach((line) => {
      debit = debit.plus(line.debit);
      credit = credit.plus(line.credit);
    });

    return credit.minus(debit); // For income accounts, credit is positive
  }
}
