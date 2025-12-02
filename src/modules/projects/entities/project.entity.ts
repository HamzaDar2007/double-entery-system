import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';
import { Customer } from '../../customers/entities/customer.entity';

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('projects')
@Index(['company', 'projectCode'], { unique: true })
export class Project extends BaseEntity {
  @Column({ name: 'project_code', length: 50 })
  projectCode: string;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.PLANNING })
  status: ProjectStatus;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date;

  @Column({ name: 'budget_amount', type: 'numeric', precision: 18, scale: 2, default: 0 })
  budgetAmount: string;

  @Column({ name: 'actual_cost', type: 'numeric', precision: 18, scale: 2, default: 0 })
  actualCost: string;

  @Column({ name: 'estimated_revenue', type: 'numeric', precision: 18, scale: 2, default: 0 })
  estimatedRevenue: string;

  @Column({ name: 'actual_revenue', type: 'numeric', precision: 18, scale: 2, default: 0 })
  actualRevenue: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'project_manager', length: 200, nullable: true })
  projectManager: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Relations
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'customer_id', type: 'uuid', nullable: true })
  customerId: string;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;
}
