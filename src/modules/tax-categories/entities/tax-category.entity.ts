import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';

export enum TaxType {
  VAT = 'vat',
  SALES_TAX = 'sales_tax',
  WITHHOLDING_TAX = 'withholding_tax',
  INCOME_TAX = 'income_tax',
  EXCISE_TAX = 'excise_tax',
  CUSTOM_DUTY = 'custom_duty',
}

@Entity('tax_categories')
@Index(['company', 'code'], { unique: true })
export class TaxCategory extends BaseEntity {
  @Column({ length: 50 })
  code: string;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: TaxType })
  type: TaxType;

  @Column({ type: 'numeric', precision: 5, scale: 2 })
  rate: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_compound', default: false })
  isCompound: boolean;

  @Column({ name: 'tax_number', length: 50, nullable: true })
  taxNumber: string;

  // Relations
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;
}
