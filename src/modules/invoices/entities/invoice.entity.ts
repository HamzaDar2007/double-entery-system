import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { InvoiceLine } from './invoice-line.entity';
import { JournalEntry } from '../../vouchers/entities/journal-entry.entity';
import { InvoiceStatus } from '../../../common/enums/invoice-status.enum';
import { InvoiceType } from '../../../common/enums/invoice-type.enum';

@Entity('invoices')
@Index(['company', 'invoiceNumber'], { unique: true })
@Index(['company', 'invoiceDate'])
@Index(['company', 'status'])
@Index(['company', 'customer'])
@Index(['company', 'supplier'])
export class Invoice extends BaseEntity {
  @Column({ name: 'invoice_number', length: 50 })
  invoiceNumber: string;

  @Column({ name: 'invoice_type', type: 'enum', enum: InvoiceType })
  invoiceType: InvoiceType;

  @Column({ name: 'invoice_date', type: 'date' })
  invoiceDate: Date;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: Date;

  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.DRAFT })
  status: InvoiceStatus;

  @Column({ name: 'reference_number', length: 100, nullable: true })
  referenceNumber: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  terms: string;

  // Amounts
  @Column({ name: 'subtotal', type: 'numeric', precision: 18, scale: 2 })
  subtotal: string;

  @Column({ name: 'tax_amount', type: 'numeric', precision: 18, scale: 2, default: 0 })
  taxAmount: string;

  @Column({ name: 'discount_amount', type: 'numeric', precision: 18, scale: 2, default: 0 })
  discountAmount: string;

  @Column({ name: 'total_amount', type: 'numeric', precision: 18, scale: 2 })
  totalAmount: string;

  @Column({ name: 'paid_amount', type: 'numeric', precision: 18, scale: 2, default: 0 })
  paidAmount: string;

  @Column({ name: 'balance_amount', type: 'numeric', precision: 18, scale: 2 })
  balanceAmount: string;

  // Discount
  @Column({ name: 'discount_percentage', type: 'numeric', precision: 5, scale: 2, default: 0 })
  discountPercentage: string;

  // Relations
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'customer_id', type: 'uuid', nullable: true })
  customerId: string;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'supplier_id', type: 'uuid', nullable: true })
  supplierId: string;

  @ManyToOne(() => Supplier, { nullable: true })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @OneToMany(() => InvoiceLine, (line) => line.invoice, { cascade: true })
  lines: InvoiceLine[];

  // Metadata
  @Column({ name: 'is_recurring', default: false })
  isRecurring: boolean;

  @Column({ name: 'recurring_frequency', length: 20, nullable: true })
  recurringFrequency: string; // monthly, quarterly, yearly

  @Column({ name: 'next_invoice_date', type: 'date', nullable: true })
  nextInvoiceDate: Date;

  @Column({ name: 'attachment_url', length: 500, nullable: true })
  attachmentUrl: string;

  @Column({ name: 'posted_at', type: 'timestamp', nullable: true })
  postedAt: Date;

  @Column({ name: 'posted_by', type: 'uuid', nullable: true })
  postedBy: string;
}
