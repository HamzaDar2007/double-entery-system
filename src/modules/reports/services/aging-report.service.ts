import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../../invoices/entities/invoice.entity';
import { InvoiceType } from '../../../common/enums/invoice-type.enum';
import Decimal from 'decimal.js';

export interface AgingBucket {
  current: string;
  days30: string;
  days60: string;
  days90: string;
  over90: string;
  total: string;
}

export interface AgingReportItem {
  code: string;
  name: string;
  aging: AgingBucket;
}

@Injectable()
export class AgingReportService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  async generateARAgingReport(
    companyId: string,
    asOfDate: Date = new Date(),
  ): Promise<{ items: AgingReportItem[]; totals: AgingBucket }> {
    const invoices = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.customer', 'customer')
      .where('invoice.company_id = :companyId', { companyId })
      .andWhere('invoice.invoice_type = :type', { type: InvoiceType.SALES })
      .andWhere('invoice.balance_amount > 0')
      .andWhere('invoice.invoice_date <= :asOfDate', { asOfDate })
      .getMany();

    const customerMap = new Map<string, AgingReportItem>();

    invoices.forEach((invoice) => {
      const customerId = invoice.customerId;
      const customerCode = invoice.customer?.customerCode || 'N/A';
      const customerName = invoice.customer?.name || 'Unknown';

      if (!customerMap.has(customerId)) {
        customerMap.set(customerId, {
          code: customerCode,
          name: customerName,
          aging: {
            current: '0',
            days30: '0',
            days60: '0',
            days90: '0',
            over90: '0',
            total: '0',
          },
        });
      }

      const item = customerMap.get(customerId)!;
      const daysOverdue = this.calculateDaysOverdue(invoice.dueDate, asOfDate);
      const balance = new Decimal(invoice.balanceAmount);

      if (daysOverdue <= 0) {
        item.aging.current = new Decimal(item.aging.current).plus(balance).toString();
      } else if (daysOverdue <= 30) {
        item.aging.days30 = new Decimal(item.aging.days30).plus(balance).toString();
      } else if (daysOverdue <= 60) {
        item.aging.days60 = new Decimal(item.aging.days60).plus(balance).toString();
      } else if (daysOverdue <= 90) {
        item.aging.days90 = new Decimal(item.aging.days90).plus(balance).toString();
      } else {
        item.aging.over90 = new Decimal(item.aging.over90).plus(balance).toString();
      }

      item.aging.total = new Decimal(item.aging.total).plus(balance).toString();
    });

    const items = Array.from(customerMap.values());

    // Calculate totals
    const totals: AgingBucket = {
      current: '0',
      days30: '0',
      days60: '0',
      days90: '0',
      over90: '0',
      total: '0',
    };

    items.forEach((item) => {
      totals.current = new Decimal(totals.current).plus(item.aging.current).toString();
      totals.days30 = new Decimal(totals.days30).plus(item.aging.days30).toString();
      totals.days60 = new Decimal(totals.days60).plus(item.aging.days60).toString();
      totals.days90 = new Decimal(totals.days90).plus(item.aging.days90).toString();
      totals.over90 = new Decimal(totals.over90).plus(item.aging.over90).toString();
      totals.total = new Decimal(totals.total).plus(item.aging.total).toString();
    });

    return { items, totals };
  }

  async generateAPAgingReport(
    companyId: string,
    asOfDate: Date = new Date(),
  ): Promise<{ items: AgingReportItem[]; totals: AgingBucket }> {
    const invoices = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.supplier', 'supplier')
      .where('invoice.company_id = :companyId', { companyId })
      .andWhere('invoice.invoice_type = :type', { type: InvoiceType.PURCHASE })
      .andWhere('invoice.balance_amount > 0')
      .andWhere('invoice.invoice_date <= :asOfDate', { asOfDate })
      .getMany();

    const supplierMap = new Map<string, AgingReportItem>();

    invoices.forEach((invoice) => {
      const supplierId = invoice.supplierId;
      const supplierCode = invoice.supplier?.supplierCode || 'N/A';
      const supplierName = invoice.supplier?.name || 'Unknown';

      if (!supplierMap.has(supplierId)) {
        supplierMap.set(supplierId, {
          code: supplierCode,
          name: supplierName,
          aging: {
            current: '0',
            days30: '0',
            days60: '0',
            days90: '0',
            over90: '0',
            total: '0',
          },
        });
      }

      const item = supplierMap.get(supplierId)!;
      const daysOverdue = this.calculateDaysOverdue(invoice.dueDate, asOfDate);
      const balance = new Decimal(invoice.balanceAmount);

      if (daysOverdue <= 0) {
        item.aging.current = new Decimal(item.aging.current).plus(balance).toString();
      } else if (daysOverdue <= 30) {
        item.aging.days30 = new Decimal(item.aging.days30).plus(balance).toString();
      } else if (daysOverdue <= 60) {
        item.aging.days60 = new Decimal(item.aging.days60).plus(balance).toString();
      } else if (daysOverdue <= 90) {
        item.aging.days90 = new Decimal(item.aging.days90).plus(balance).toString();
      } else {
        item.aging.over90 = new Decimal(item.aging.over90).plus(balance).toString();
      } 

      item.aging.total = new Decimal(item.aging.total).plus(balance).toString();
    });

    const items = Array.from(supplierMap.values());

    // Calculate totals
    const totals: AgingBucket = {
      current: '0',
      days30: '0',
      days60: '0',
      days90: '0',
      over90: '0',
      total: '0',
    };

    items.forEach((item) => {
      totals.current = new Decimal(totals.current).plus(item.aging.current).toString();
      totals.days30 = new Decimal(totals.days30).plus(item.aging.days30).toString();
      totals.days60 = new Decimal(totals.days60).plus(item.aging.days60).toString();
      totals.days90 = new Decimal(totals.days90).plus(item.aging.days90).toString();
      totals.over90 = new Decimal(totals.over90).plus(item.aging.over90).toString();
      totals.total = new Decimal(totals.total).plus(item.aging.total).toString();
    });

    return { items, totals };
  }

  private calculateDaysOverdue(dueDate: Date, asOfDate: Date): number {
    if (!dueDate) return 0;
    const due = new Date(dueDate);
    const asOf = new Date(asOfDate);
    const diffTime = asOf.getTime() - due.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }
}
