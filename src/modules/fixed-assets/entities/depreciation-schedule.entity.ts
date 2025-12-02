import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { FixedAsset } from './fixed-asset.entity';

@Entity('depreciation_schedules')
export class DepreciationSchedule extends BaseEntity {
  @ManyToOne(() => FixedAsset)
  @JoinColumn({ name: 'fixed_asset_id' })
  fixedAsset: FixedAsset;

  @Column({ name: 'fixed_asset_id' })
  fixedAssetId: string;

  @Column({ type: 'date' })
  scheduleDate: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  @Column({ default: false })
  isPosted: boolean;
}
