import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';

@Entity('customers')
@Index(['company', 'customerCode'], { unique: true })
@Index(['company', 'email'])
export class Customer extends BaseEntity {
  @Column({ name: 'customer_code', length: 50 })
  customerCode: string;

  @Column({ length: 200 })
  name: string;

  @Column({ length: 200, nullable: true })
  email: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ length: 50, nullable: true })
  mobile: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 100, nullable: true })
  state: string;

  @Column({ length: 20, nullable: true })
  country: string;

  @Column({ name: 'postal_code', length: 20, nullable: true })
  postalCode: string;

  @Column({ name: 'tax_number', length: 50, nullable: true })
  taxNumber: string;

  @Column({ name: 'credit_limit', type: 'numeric', precision: 18, scale: 2, default: 0 })
  creditLimit: string;

  @Column({ name: 'credit_days', type: 'int', default: 0 })
  creditDays: number;

  @Column({ name: 'current_balance', type: 'numeric', precision: 18, scale: 2, default: 0 })
  currentBalance: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'contact_person', length: 200, nullable: true })
  contactPerson: string;

  @Column({ name: 'payment_terms', type: 'text', nullable: true })
  paymentTerms: string;

  // Relations
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;
}
