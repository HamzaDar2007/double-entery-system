import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';
import { TaxCategory } from '../../tax-categories/entities/tax-category.entity';
import { Account } from '../../accounts/entities/account.entity';

@Entity('items')
@Index(['company', 'itemCode'], { unique: true })
@Index(['company', 'name'])
export class Item extends BaseEntity {
  @Column({ name: 'item_code', length: 50 })
  itemCode: string;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'unit_of_measure', length: 20, default: 'pcs' })
  unitOfMeasure: string;

  @Column({ name: 'sales_price', type: 'numeric', precision: 18, scale: 2, default: 0 })
  salesPrice: string;

  @Column({ name: 'purchase_price', type: 'numeric', precision: 18, scale: 2, default: 0 })
  purchasePrice: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_inventory_item', default: false })
  isInventoryItem: boolean;

  @Column({ name: 'current_stock', type: 'numeric', precision: 18, scale: 4, default: 0 })
  currentStock: string;

  @Column({ name: 'reorder_level', type: 'numeric', precision: 18, scale: 4, default: 0 })
  reorderLevel: string;

  @Column({ name: 'barcode', length: 100, nullable: true })
  barcode: string;

  @Column({ name: 'sku', length: 100, nullable: true })
  sku: string;

  @Column({ length: 50, nullable: true })
  category: string;

  @Column({ length: 50, nullable: true })
  brand: string;

  // Relations
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'sales_tax_category_id', type: 'uuid', nullable: true })
  salesTaxCategoryId: string;

  @ManyToOne(() => TaxCategory, { nullable: true })
  @JoinColumn({ name: 'sales_tax_category_id' })
  salesTaxCategory: TaxCategory;

  @Column({ name: 'purchase_tax_category_id', type: 'uuid', nullable: true })
  purchaseTaxCategoryId: string;

  @ManyToOne(() => TaxCategory, { nullable: true })
  @JoinColumn({ name: 'purchase_tax_category_id' })
  purchaseTaxCategory: TaxCategory;

  @Column({ name: 'sales_account_id', type: 'uuid', nullable: true })
  salesAccountId: string;

  @ManyToOne(() => Account, { nullable: true })
  @JoinColumn({ name: 'sales_account_id' })
  salesAccount: Account;

  @Column({ name: 'purchase_account_id', type: 'uuid', nullable: true })
  purchaseAccountId: string;

  @ManyToOne(() => Account, { nullable: true })
  @JoinColumn({ name: 'purchase_account_id' })
  purchaseAccount: Account;

  @Column({ name: 'inventory_account_id', type: 'uuid', nullable: true })
  inventoryAccountId: string;

  @ManyToOne(() => Account, { nullable: true })
  @JoinColumn({ name: 'inventory_account_id' })
  inventoryAccount: Account;
}
