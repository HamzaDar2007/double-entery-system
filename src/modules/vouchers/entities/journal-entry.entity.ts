import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';
import { FiscalYear } from '../../fiscal-years/entities/fiscal-year.entity';
import { VoucherType } from './voucher-type.entity';
import { User } from '../../users/entities/user.entity';
import { EntryStatus } from '../../../common/enums/entry-status.enum';
import { JournalEntryLine } from './journal-entry-line.entity';

@Entity('journal_entries')
export class JournalEntry extends BaseEntity {
    @Column({ name: 'company_id' })
    companyId: string;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Column({ name: 'fiscal_year_id' })
    fiscalYearId: string;

    @ManyToOne(() => FiscalYear)
    @JoinColumn({ name: 'fiscal_year_id' })
    fiscalYear: FiscalYear;

    @Column({ name: 'voucher_type_id' })
    voucherTypeId: string;

    @ManyToOne(() => VoucherType)
    @JoinColumn({ name: 'voucher_type_id' })
    voucherType: VoucherType;

    @Column({ name: 'voucher_no' })
    voucherNo: string;

    @Column({ name: 'entry_date', type: 'date' })
    entryDate: Date;

    @Column({ name: 'posting_date', type: 'date' })
    postingDate: Date;

    @Column({ nullable: true })
    reference: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'source_module', nullable: true })
    sourceModule: string;

    @Column({
        type: 'enum',
        enum: EntryStatus,
        default: EntryStatus.DRAFT,
    })
    status: EntryStatus;

    @Column({ default: false })
    posted: boolean;

    @Column({ name: 'posted_at', nullable: true })
    postedAt: Date;

    @Column({ name: 'posted_by', nullable: true })
    postedBy: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'posted_by' })
    postedByUser: User;

    @Column({ name: 'approved_by', nullable: true })
    approvedBy: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'approved_by' })
    approvedByUser: User;

    @Column({ name: 'approved_at', nullable: true })
    approvedAt: Date;

    @Column({ name: 'reversed_by_id', nullable: true })
    reversedById: string;

    @Column({ name: 'reversal_of_id', nullable: true })
    reversalOfId: string;

    @Column({
        name: 'attachment_urls',
        type: 'text',
        array: true,
        nullable: true,
    })
    attachmentUrls: string[];

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ name: 'created_by' })
    createdBy: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    createdByUser: User;

    @OneToMany(() => JournalEntryLine, (line) => line.journalEntry, {
        cascade: true,
    })
    lines: JournalEntryLine[];
}
