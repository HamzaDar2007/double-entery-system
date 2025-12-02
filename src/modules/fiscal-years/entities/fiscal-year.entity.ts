import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';
import { User } from '../../users/entities/user.entity';

@Entity('fiscal_years')
export class FiscalYear extends BaseEntity {
    @Column({ name: 'company_id' })
    companyId: string;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Column({ name: 'year_name' })
    yearName: string;

    @Column({ name: 'start_date', type: 'date' })
    startDate: Date;

    @Column({ name: 'end_date', type: 'date' })
    endDate: Date;

    @Column({ name: 'is_closed', default: false })
    isClosed: boolean;

    @Column({ name: 'closed_at', nullable: true })
    closedAt: Date;

    @Column({ name: 'closed_by', nullable: true })
    closedBy: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'closed_by' })
    closedByUser: User;
}
