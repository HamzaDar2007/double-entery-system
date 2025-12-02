import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JournalEntry } from '../../vouchers/entities/journal-entry.entity';

export interface JournalRegisterEntry {
  date: Date;
  voucherNumber: string;
  description: string;
  reference: string;
  status: string;
}

@Injectable()
export class JournalRegisterService {
  constructor(
    @InjectRepository(JournalEntry)
    private readonly journalEntryRepository: Repository<JournalEntry>,
  ) {}

  async generateJournalRegister(
    companyId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<JournalRegisterEntry[]> {
    const query = this.journalEntryRepository
      .createQueryBuilder('entry')
      .where('entry.company_id = :companyId', { companyId });

    if (startDate) {
      query.andWhere('entry.entry_date >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('entry.entry_date <= :endDate', { endDate });
    }

    const entries = await query.orderBy('entry.entry_date', 'ASC').getMany();

    return entries.map((entry) => ({
      date: entry.entryDate,
      voucherNumber: entry.voucherNo,
      description: entry.description || '',
      reference: entry.reference || '',
      status: entry.status,
    }));
  }

  async generateDayBook(
    companyId: string,
    date: Date,
  ): Promise<JournalRegisterEntry[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.generateJournalRegister(companyId, startOfDay, endOfDay);
  }
}
