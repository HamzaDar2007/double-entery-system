import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('currencies')
export class Currency extends BaseEntity {
  @Column({ unique: true, length: 3 })
  code: string;

  @Column()
  name: string;

  @Column({ length: 5 })
  symbol: string;

  @Column({ default: false })
  isBase: boolean;

  @Column({ default: true })
  isActive: boolean;
}
