import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';

@Entity('cost_centers')
export class CostCenter extends BaseEntity {
    @Column({ name: 'company_id' })
    companyId: string;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Column()
    code: string;

    @Column()
    name: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;
}
