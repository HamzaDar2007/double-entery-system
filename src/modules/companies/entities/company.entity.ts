import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('companies')
export class Company extends BaseEntity {
    @Column()
    name: string;

    @Column({ name: 'legal_name', nullable: true })
    legalName: string;

    @Column({ name: 'registration_no', nullable: true })
    registrationNo: string;

    @Column({ name: 'tax_registration_no', nullable: true })
    taxRegistrationNo: string;

    @Column({ name: 'country_code', length: 3 })
    countryCode: string;

    @Column({ name: 'currency_code', length: 3 })
    currencyCode: string;

    @Column({ name: 'fiscal_year_start_month', default: 1 })
    fiscalYearStartMonth: number;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    email: string;

    @Column({ name: 'logo_url', type: 'text', nullable: true })
    logoUrl: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column({ type: 'jsonb', default: {} })
    settings: Record<string, any>;
}
