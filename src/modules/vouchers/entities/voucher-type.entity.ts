import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';
import { VoucherNature } from '../../../common/enums/voucher-nature.enum';

@Entity('voucher_types')
export class VoucherType extends BaseEntity {
    @Column({ name: 'company_id' })
    companyId: string;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Column()
    code: string;

    @Column()
    name: string;

    @Column({
        type: 'enum',
        enum: VoucherNature,
    })
    nature: VoucherNature;

    @Column({ name: 'auto_numbering', default: true })
    autoNumbering: boolean;

    @Column({ nullable: true })
    prefix: string;

    @Column({ name: 'next_sequence', type: 'bigint', default: 1 })
    nextSequence: number;

    @Column({ name: 'reset_frequency', default: 'yearly' })
    resetFrequency: 'yearly' | 'monthly' | 'never';

    @Column({ name: 'requires_approval', default: false })
    requiresApproval: boolean;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;
}
