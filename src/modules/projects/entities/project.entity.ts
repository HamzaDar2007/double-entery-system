import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';

@Entity('projects')
export class Project extends BaseEntity {
    @Column({ name: 'company_id' })
    companyId: string;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Column()
    code: string;

    @Column()
    name: string;

    @Column({ name: 'start_date', type: 'date', nullable: true })
    startDate: Date;

    @Column({ name: 'end_date', type: 'date', nullable: true })
    endDate: Date;

    @Column({
        name: 'budget_amount',
        type: 'numeric',
        precision: 18,
        scale: 2,
        nullable: true,
    })
    budgetAmount: number;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;
}
