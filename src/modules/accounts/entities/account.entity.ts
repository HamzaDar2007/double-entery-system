import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';
import { AccountType } from '../../../common/enums/account-type.enum';
import { AccountLevel } from '../../../common/enums/account-level.enum';
import { TaxCategory } from '../../tax-categories/entities/tax-category.entity';

@Entity('accounts')
export class Account extends BaseEntity {
    @Column({ name: 'company_id' })
    companyId: string;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Column()
    code: string;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({
        type: 'enum',
        enum: AccountType,
    })
    type: AccountType;

    @Column({
        type: 'enum',
        enum: AccountLevel,
    })
    level: AccountLevel;

    @Column({ name: 'parent_id', nullable: true })
    parentId: string;

    @ManyToOne(() => Account, (account) => account.children)
    @JoinColumn({ name: 'parent_id' })
    parent: Account;

    @OneToMany(() => Account, (account) => account.parent)
    children: Account[];

    @Column({ name: 'is_posting', default: false })
    isPosting: boolean;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column({ name: 'is_system', default: false })
    isSystem: boolean;

    @Column({
        name: 'opening_balance',
        type: 'numeric',
        precision: 18,
        scale: 2,
        default: 0,
    })
    openingBalance: number;

    @Column({ name: 'opening_balance_type', nullable: true })
    openingBalanceType: 'debit' | 'credit';

    @Column({
        name: 'current_balance',
        type: 'numeric',
        precision: 18,
        scale: 2,
        default: 0,
    })
    currentBalance: number;

    @Column({ name: 'currency_code', length: 3, nullable: true })
    currencyCode: string;

    @Column({ name: 'allow_reconciliation', default: false })
    allowReconciliation: boolean;

    @Column({ name: 'tax_category_id', nullable: true })
    taxCategoryId: string;

    @ManyToOne(() => TaxCategory)
    @JoinColumn({ name: 'tax_category_id' })
    taxCategory: TaxCategory;

    @Column({ name: 'sort_order', default: 0 })
    sortOrder: number;
}
