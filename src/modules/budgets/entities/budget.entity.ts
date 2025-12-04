import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Account } from '../../accounts/entities/account.entity';
import { FiscalYear } from '../../fiscal-years/entities/fiscal-year.entity';

@Entity('budgets')
export class Budget extends BaseEntity {
  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ name: 'account_id' })
  accountId: string;

  @ManyToOne(() => FiscalYear)
  @JoinColumn({ name: 'fiscal_year_id' })
  fiscalYear: FiscalYear;

  @Column({ name: 'fiscal_year_id' })
  fiscalYearId: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  period: string; // MONTHLY, QUARTERLY, YEARLY

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'company_id' })
  companyId: string;
}
