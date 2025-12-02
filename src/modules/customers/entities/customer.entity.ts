import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';
import { Account } from '../../accounts/entities/account.entity';

@Entity('customers')
export class Customer extends BaseEntity {
    @Column({ name: 'company_id' })
    companyId: string;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Column()
    code: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ name: 'tax_registration_no', nullable: true })
    taxRegistrationNo: string;

    @Column({
        name: 'credit_limit',
        type: 'numeric',
        precision: 18,
        scale: 2,
        default: 0,
    })
    creditLimit: number;

    @Column({ name: 'payment_terms', default: 30 })
    paymentTerms: number;

    @Column({ name: 'account_id', nullable: true })
    accountId: string;

    @ManyToOne(() => Account)
    @JoinColumn({ name: 'account_id' })
    account: Account;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;
}
