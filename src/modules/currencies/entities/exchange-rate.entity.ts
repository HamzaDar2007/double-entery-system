import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Currency } from './currency.entity';

@Entity('exchange_rates')
export class ExchangeRate extends BaseEntity {
  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'from_currency_id' })
  fromCurrency: Currency;

  @Column({ name: 'from_currency_id' })
  fromCurrencyId: string;

  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'to_currency_id' })
  toCurrency: Currency;

  @Column({ name: 'to_currency_id' })
  toCurrencyId: string;

  @Column({ type: 'decimal', precision: 18, scale: 6 })
  rate: number;

  @Column({ type: 'date' })
  validFrom: string;
}
