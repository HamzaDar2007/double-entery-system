import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';

@Entity('tax_categories')
export class TaxCategory extends BaseEntity {
    @Column({ name: 'company_id' })
    companyId: string;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Column()
    code: string;

    @Column()
    name: string;

    @Column({ type: 'numeric', precision: 5, scale: 2 })
    rate: number;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;
}
