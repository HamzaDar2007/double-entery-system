import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';
import { JournalEntryLine } from '../../vouchers/entities/journal-entry-line.entity';
import { AccountType } from '../../../common/enums/account-type.enum';
import Decimal from 'decimal.js';

export interface BalanceSheetSection {
  accounts: Array<{ code: string; name: string; amount: string }>;
  total: string;
}

export interface BalanceSheetReport {
  assets: BalanceSheetSection;
  liabilities: BalanceSheetSection;
  equity: BalanceSheetSection;
  totalAssets: string;
  totalLiabilitiesAndEquity: string;
}

@Injectable()
export class BalanceSheetService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(JournalEntryLine)
    private readonly journalEntryLineRepository: Repository<JournalEntryLine>,
  ) {}

  async generateBalanceSheet(
    companyId: string,
    asOfDate: Date,
  ): Promise<BalanceSheetReport> {
    const assets = await this.getAccountsByType(
      companyId,
      AccountType.ASSET,
      asOfDate,
    );
    const liabilities = await this.getAccountsByType(
      companyId,
      AccountType.LIABILITY,
      asOfDate,
    );
    const equity = await this.getAccountsByType(
      companyId,
      AccountType.EQUITY,
      asOfDate,
    );

    const totalAssets = this.calculateTotal(assets.accounts);
    const totalLiabilities = this.calculateTotal(liabilities.accounts);
    const totalEquity = this.calculateTotal(equity.accounts);
    const totalLiabilitiesAndEquity = new Decimal(totalLiabilities).plus(totalEquity);

    return {
      assets: {
        accounts: assets.accounts,
        total: totalAssets.toString(),
      },
      liabilities: {
        accounts: liabilities.accounts,
        total: totalLiabilities.toString(),
      },
      equity: {
        accounts: equity.accounts,
        total: totalEquity.toString(),
      },
      totalAssets: totalAssets.toString(),
      totalLiabilitiesAndEquity: totalLiabilitiesAndEquity.toString(),
    };
  }

  private async getAccountsByType(
    companyId: string,
    type: AccountType,
    asOfDate: Date,
  ): Promise<{ accounts: Array<{ code: string; name: string; amount: string }> }> {
    const accounts = await this.accountRepository.find({
      where: { companyId, type, isActive: true },
      order: { code: 'ASC' },
    });

    const accountsWithBalances: Array<{ code: string; name: string; amount: string }> = [];

    for (const account of accounts) {
      const balance = await this.getAccountBalance(account.id, companyId, asOfDate);

      if (!balance.isZero()) {
        accountsWithBalances.push({
          code: account.code,
          name: account.name,
          amount: balance.abs().toString(),
        });
      }
    }

    return { accounts: accountsWithBalances };
  }

  private async getAccountBalance(
    accountId: string,
    companyId: string,
    asOfDate: Date,
  ): Promise<Decimal> {
    const lines = await this.journalEntryLineRepository
      .createQueryBuilder('line')
      .leftJoin('line.journalEntry', 'entry')
      .where('line.account_id = :accountId', { accountId })
      .andWhere('entry.company_id = :companyId', { companyId })
      .andWhere('entry.status = :status', { status: 'posted' })
      .andWhere('entry.entry_date <= :asOfDate', { asOfDate })
      .getMany();

    let debit = new Decimal(0);
    let credit = new Decimal(0);

    lines.forEach((line) => {
      debit = debit.plus(line.debit);
      credit = credit.plus(line.credit);
    });

    return debit.minus(credit);
  }

  private calculateTotal(
    accounts: Array<{ code: string; name: string; amount: string }>,
  ): Decimal {
    return accounts.reduce(
      (sum, account) => sum.plus(account.amount),
      new Decimal(0),
    );
  }
}
