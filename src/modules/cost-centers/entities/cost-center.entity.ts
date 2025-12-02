import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  Tree,
  TreeParent,
  TreeChildren,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';

@Entity('cost_centers')
@Tree('closure-table')
@Index(['company', 'code'], { unique: true })
export class CostCenter extends BaseEntity {
  @Column({ length: 50 })
  code: string;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'budget_amount', type: 'numeric', precision: 18, scale: 2, default: 0 })
  budgetAmount: string;

  @Column({ name: 'actual_amount', type: 'numeric', precision: 18, scale: 2, default: 0 })
  actualAmount: string;

  // Relations
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @TreeParent()
  parent: CostCenter;

  @TreeChildren()
  children: CostCenter[];
}
