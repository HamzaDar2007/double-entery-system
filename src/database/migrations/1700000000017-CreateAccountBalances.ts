import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
    TableIndex,
} from 'typeorm';

export class CreateAccountBalances1700000000017 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'account_balances',
                columns: [
                    {
                        name: 'company_id',
                        type: 'uuid',
                        isPrimary: true,
                    },
                    {
                        name: 'account_id',
                        type: 'uuid',
                        isPrimary: true,
                    },
                    {
                        name: 'fiscal_year_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'period',
                        type: 'date',
                        isPrimary: true,
                    },
                    {
                        name: 'opening_debit',
                        type: 'numeric',
                        precision: 18,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'opening_credit',
                        type: 'numeric',
                        precision: 18,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'period_debit',
                        type: 'numeric',
                        precision: 18,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'period_credit',
                        type: 'numeric',
                        precision: 18,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'closing_debit',
                        type: 'numeric',
                        precision: 18,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'closing_credit',
                        type: 'numeric',
                        precision: 18,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            'account_balances',
            new TableForeignKey({
                columnNames: ['company_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'companies',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'account_balances',
            new TableForeignKey({
                columnNames: ['account_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'accounts',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'account_balances',
            new TableForeignKey({
                columnNames: ['fiscal_year_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'fiscal_years',
            }),
        );

        await queryRunner.createIndex(
            'account_balances',
            new TableIndex({
                name: 'idx_balances_account',
                columnNames: ['account_id', 'period'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('account_balances');
    }
}
