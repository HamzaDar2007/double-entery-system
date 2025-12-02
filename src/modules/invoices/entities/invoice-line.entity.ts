import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Invoice } from './invoice.entity';
import { Item } from '../../items/entities/item.entity';
import { TaxCategory } from '../../tax-categories/entities/tax-category.entity';
import { Account } from '../../accounts/entities/account.entity';

@Entity('invoice_lines')
@Index(['invoice'])
export class InvoiceLine extends BaseEntity {
  @Column({ name: 'line_number', type: 'int' })
  lineNumber: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'numeric', precision: 18, scale: 4 })
  quantity: string;

  @Column({ name: 'unit_price', type: 'numeric', precision: 18, scale: 2 })
  unitPrice: string;

  @Column({ name: 'line_total', type: 'numeric', precision: 18, scale: 2 })
  lineTotal: string;

  @Column({ name: 'discount_percentage', type: 'numeric', precision: 5, scale: 2, default: 0 })
  discountPercentage: string;

  @Column({ name: 'discount_amount', type: 'numeric', precision: 18, scale: 2, default: 0 })
  discountAmount: string;

  @Column({ name: 'tax_percentage', type: 'numeric', precision: 5, scale: 2, default: 0 })
  taxPercentage: string;

  @Column({ name: 'tax_amount', type: 'numeric', precision: 18, scale: 2, default: 0 })
  taxAmount: string;

  @Column({ name: 'net_amount', type: 'numeric', precision: 18, scale: 2 })
  netAmount: string;

  // Relations
  @Column({ name: 'invoice_id', type: 'uuid' })
  invoiceId: string;

  @ManyToOne(() => Invoice, (invoice) => invoice.lines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @Column({ name: 'item_id', type: 'uuid', nullable: true })
  itemId: string;

  @ManyToOne(() => Item, { nullable: true })
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @Column({ name: 'tax_category_id', type: 'uuid', nullable: true })
  taxCategoryId: string;

  @ManyToOne(() => TaxCategory, { nullable: true })
  @JoinColumn({ name: 'tax_category_id' })
  taxCategory: TaxCategory;

  @Column({ name: 'account_id', type: 'uuid', nullable: true })
  accountId: string;

  @ManyToOne(() => Account, { nullable: true })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ name: 'unit_of_measure', length: 20, nullable: true })
  unitOfMeasure: string;
}
