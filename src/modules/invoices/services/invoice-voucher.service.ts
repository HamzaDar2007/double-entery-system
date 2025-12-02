import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { JournalEntry } from '../../vouchers/entities/journal-entry.entity';
import { JournalEntryLine } from '../../vouchers/entities/journal-entry-line.entity';
import { Invoice } from '../entities/invoice.entity';
import { InvoiceType } from '../../../common/enums/invoice-type.enum';
import { EntryStatus } from '../../../common/enums/entry-status.enum';
import Decimal from 'decimal.js';

@Injectable()
export class InvoiceVoucherService {
  constructor(
    @InjectRepository(JournalEntry)
    private readonly journalEntryRepository: Repository<JournalEntry>,
    @InjectRepository(JournalEntryLine)
    private readonly journalEntryLineRepository: Repository<JournalEntryLine>,
  ) {}

  async generateVoucherFromInvoice(invoice: Invoice): Promise<void> {
    // Create journal entry for invoice
    const journalEntry = this.journalEntryRepository.create({
      companyId: invoice.companyId,
      fiscalYearId: null,
      voucherTypeId: null,
      voucherNo: `INV-${invoice.invoiceNumber}`,
      entryDate: invoice.invoiceDate,
      postingDate: invoice.invoiceDate,
      reference: invoice.invoiceNumber,
      description: `Invoice ${invoice.invoiceNumber} - ${invoice.invoiceType}`,
      status: EntryStatus.DRAFT,
      posted: false,
      createdBy: 'system',
    } as unknown as DeepPartial<JournalEntry>); // Use any to bypass strict type checks for now if needed, or better: DeepPartial<JournalEntry>

    const savedEntry = await this.journalEntryRepository.save(journalEntry);

    // Create journal entry lines
    const lines: any[] = [];

    if (invoice.invoiceType === InvoiceType.SALES) {
      // Debit: Accounts Receivable
      lines.push({
        companyId: invoice.companyId,
        journalEntryId: savedEntry.id,
        accountId: null,
        description: `AR for Invoice ${invoice.invoiceNumber}`,
        debit: parseFloat(invoice.totalAmount),
        credit: 0,
      });

      // Credit: Sales Revenue
      lines.push({
        companyId: invoice.companyId,
        journalEntryId: savedEntry.id,
        accountId: null,
        description: `Sales for Invoice ${invoice.invoiceNumber}`,
        debit: 0,
        credit: parseFloat(invoice.subtotal),
      });

      // Credit: Tax Payable (if tax exists)
      if (new Decimal(invoice.taxAmount).greaterThan(0)) {
        lines.push({
          companyId: invoice.companyId,
          journalEntryId: savedEntry.id,
          accountId: null,
          description: `Tax for Invoice ${invoice.invoiceNumber}`,
          debit: 0,
          credit: parseFloat(invoice.taxAmount),
        });
      }
    } else {
      // Purchase Invoice
      // Debit: Purchases/Expenses
      lines.push({
        companyId: invoice.companyId,
        journalEntryId: savedEntry.id,
        accountId: null,
        description: `Purchase for Invoice ${invoice.invoiceNumber}`,
        debit: parseFloat(invoice.subtotal),
        credit: 0,
      });

      // Debit: Tax Receivable (if tax exists)
      if (new Decimal(invoice.taxAmount).greaterThan(0)) {
        lines.push({
          companyId: invoice.companyId,
          journalEntryId: savedEntry.id,
          accountId: null,
          description: `Tax for Invoice ${invoice.invoiceNumber}`,
          debit: parseFloat(invoice.taxAmount),
          credit: 0,
        });
      }

      // Credit: Accounts Payable
      lines.push({
        companyId: invoice.companyId,
        journalEntryId: savedEntry.id,
        accountId: null,
        description: `AP for Invoice ${invoice.invoiceNumber}`,
        debit: 0,
        credit: parseFloat(invoice.totalAmount),
      });
    }

    await this.journalEntryLineRepository.save(lines);
  }

  async generateVoucherFromPayment(
    invoice: Invoice,
    paymentAmount: string,
  ): Promise<void> {
    const journalEntry = this.journalEntryRepository.create({
      companyId: invoice.companyId,
      fiscalYearId: null,
      voucherTypeId: null,
      voucherNo: `PMT-${invoice.invoiceNumber}-${Date.now()}`,
      entryDate: new Date(),
      postingDate: new Date(),
      reference: invoice.invoiceNumber,
      description: `Payment for Invoice ${invoice.invoiceNumber}`,
      status: EntryStatus.DRAFT,
      posted: false,
      createdBy: 'system',
    } as unknown as DeepPartial<JournalEntry>);

    const savedEntry = await this.journalEntryRepository.save(journalEntry);

    const lines: any[] = [];

    if (invoice.invoiceType === InvoiceType.SALES) {
      // Debit: Cash/Bank
      lines.push({
        companyId: invoice.companyId,
        journalEntryId: savedEntry.id,
        accountId: null,
        description: `Payment received for Invoice ${invoice.invoiceNumber}`,
        debit: parseFloat(paymentAmount),
        credit: 0,
      });

      // Credit: Accounts Receivable
      lines.push({
        companyId: invoice.companyId,
        journalEntryId: savedEntry.id,
        accountId: null,
        description: `AR payment for Invoice ${invoice.invoiceNumber}`,
        debit: 0,
        credit: parseFloat(paymentAmount),
      });
    } else {
      // Purchase Payment
      // Debit: Accounts Payable
      lines.push({
        companyId: invoice.companyId,
        journalEntryId: savedEntry.id,
        accountId: null,
        description: `AP payment for Invoice ${invoice.invoiceNumber}`,
        debit: parseFloat(paymentAmount),
        credit: 0,
      });

      // Credit: Cash/Bank
      lines.push({
        companyId: invoice.companyId,
        journalEntryId: savedEntry.id,
        accountId: null,
        description: `Payment made for Invoice ${invoice.invoiceNumber}`,
        debit: 0,
        credit: parseFloat(paymentAmount),
      });
    }

    await this.journalEntryLineRepository.save(lines);
  }
}
