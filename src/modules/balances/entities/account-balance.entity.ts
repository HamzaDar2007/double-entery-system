import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Account } from '../../accounts/entities/account.entity';
import { FiscalYear } from '../../fiscal-years/entities/fiscal-year.entity';

@Entity('account_balances')
export class AccountBalance extends BaseEntity {
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

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  openingBalance: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  debitAmount: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  creditAmount: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  closingBalance: number;
}
