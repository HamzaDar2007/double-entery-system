import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';
import { JournalEntry } from './journal-entry.entity';
import { Account } from '../../accounts/entities/account.entity';
import { CostCenter } from '../../cost-centers/entities/cost-center.entity';
import { Project } from '../../projects/entities/project.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { Reconciliation } from '../../reconciliations/entities/reconciliation.entity';

@Entity('journal_entry_lines')
export class JournalEntryLine extends BaseEntity {
    @Column({ name: 'company_id' })
    companyId: string;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Column({ name: 'journal_entry_id' })
    journalEntryId: string;

    @ManyToOne(() => JournalEntry, (entry) => entry.lines, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'journal_entry_id' })
    journalEntry: JournalEntry;

    @Column({ name: 'account_id' })
    accountId: string;

    @ManyToOne(() => Account)
    @JoinColumn({ name: 'account_id' })
    account: Account;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'numeric', precision: 18, scale: 2, default: 0 })
    debit: number;

    @Column({ type: 'numeric', precision: 18, scale: 2, default: 0 })
    credit: number;

    @Column({ name: 'cost_center_id', nullable: true })
    costCenterId: string;

    @ManyToOne(() => CostCenter)
    @JoinColumn({ name: 'cost_center_id' })
    costCenter: CostCenter;

    @Column({ name: 'project_id', nullable: true })
    projectId: string;

    @ManyToOne(() => Project)
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @Column({ name: 'customer_id', nullable: true })
    customerId: string;

    @ManyToOne(() => Customer)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @Column({ name: 'supplier_id', nullable: true })
    supplierId: string;

    @ManyToOne(() => Supplier)
    @JoinColumn({ name: 'supplier_id' })
    supplier: Supplier;

    @Column({ name: 'reconciliation_id', nullable: true })
    reconciliationId: string;

    @ManyToOne(() => Reconciliation)
    @JoinColumn({ name: 'reconciliation_id' })
    reconciliation: Reconciliation;
}
