import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';
import { Account } from '../../accounts/entities/account.entity';
import { User } from '../../users/entities/user.entity';

@Entity('reconciliations')
export class Reconciliation extends BaseEntity {
    @Column({ name: 'company_id' })
    companyId: string;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Column({ name: 'account_id' })
    accountId: string;

    @ManyToOne(() => Account)
    @JoinColumn({ name: 'account_id' })
    account: Account;

    @Column({ name: 'statement_date', type: 'date' })
    statementDate: Date;

    @Column({
        name: 'statement_balance',
        type: 'numeric',
        precision: 18,
        scale: 2,
    })
    statementBalance: number;

    @Column({ name: 'book_balance', type: 'numeric', precision: 18, scale: 2 })
    bookBalance: number;

    @Column({
        type: 'numeric',
        precision: 18,
        scale: 2,
        generatedType: 'STORED',
        asExpression: 'statement_balance - book_balance',
    })
    difference: number;

    @Column({ name: 'is_reconciled', default: false })
    isReconciled: boolean;

    @Column({ name: 'reconciled_by', nullable: true })
    reconciledBy: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'reconciled_by' })
    reconciledByUser: User;

    @Column({ name: 'reconciled_at', nullable: true })
    reconciledAt: Date;
}
