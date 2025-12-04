import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('fixed_assets')
export class FixedAsset extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'date' })
  purchaseDate: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  purchaseCost: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  salvageValue: number;

  @Column()
  usefulLifeYears: number;

  @Column({ default: 'STRAIGHT_LINE' })
  depreciationMethod: string;

  @Column({ default: 'ACTIVE' })
  status: string;

  @Column({ name: 'company_id' })
  companyId: string;
}
