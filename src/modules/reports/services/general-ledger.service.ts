import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JournalEntryLine } from '../../vouchers/entities/journal-entry-line.entity';
import { Account } from '../../accounts/entities/account.entity';
import Decimal from 'decimal.js';

export interface GeneralLedgerEntry {
  date: Date;
  voucherNumber: string;
  description: string;
  debit: string;
  credit: string;
  balance: string;
}

@Injectable()
export class GeneralLedgerService {
  constructor(
    @InjectRepository(JournalEntryLine)
    private readonly journalEntryLineRepository: Repository<JournalEntryLine>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async generateGeneralLedger(
    accountId: string,
    companyId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ account: Account; entries: GeneralLedgerEntry[]; openingBalance: string; closingBalance: string }> {
    const account = await this.accountRepository.findOne({
      where: { id: accountId, companyId },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    // Calculate opening balance
    const openingBalance = await this.calculateOpeningBalance(
      accountId,
      companyId,
      startDate,
    );

    // Get entries
    const query = this.journalEntryLineRepository
      .createQueryBuilder('line')
      .leftJoinAndSelect('line.journalEntry', 'entry')
      .where('line.account_id = :accountId', { accountId })
      .andWhere('entry.company_id = :companyId', { companyId })
      .andWhere('entry.status = :status', { status: 'posted' });

    if (startDate) {
      query.andWhere('entry.entry_date >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('entry.entry_date <= :endDate', { endDate });
    }

    const lines = await query.orderBy('entry.entry_date', 'ASC').getMany();

    let runningBalance = new Decimal(openingBalance);
    const entries: GeneralLedgerEntry[] = [];

    lines.forEach((line) => {
      const debit = new Decimal(line.debit);
      const credit = new Decimal(line.credit);
      runningBalance = runningBalance.plus(debit).minus(credit);

      entries.push({
        date: line.journalEntry.entryDate,
        voucherNumber: line.journalEntry.voucherNo,
        description: line.description,
        debit: line.debit.toString(),
        credit: line.credit.toString(),
        balance: runningBalance.toString(),
      });
    });

    return {
      account,
      entries,
      openingBalance: openingBalance.toString(),
      closingBalance: runningBalance.toString(),
    };
  }

  private async calculateOpeningBalance(
    accountId: string,
    companyId: string,
    beforeDate?: Date,
  ): Promise<Decimal> {
    if (!beforeDate) {
      return new Decimal(0);
    }

    const lines = await this.journalEntryLineRepository
      .createQueryBuilder('line')
      .leftJoin('line.journalEntry', 'entry')
      .where('line.account_id = :accountId', { accountId })
      .andWhere('entry.company_id = :companyId', { companyId })
      .andWhere('entry.status = :status', { status: 'posted' })
      .andWhere('entry.entry_date < :beforeDate', { beforeDate })
      .getMany();

    let debit = new Decimal(0);
    let credit = new Decimal(0);

    lines.forEach((line) => {
      debit = debit.plus(line.debit);
      credit = credit.plus(line.credit);
    });

    return debit.minus(credit);
  }
}
