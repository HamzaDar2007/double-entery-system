import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
    TableIndex,
} from 'typeorm';

export class CreateAccounts1700000000005 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create Enums
        await queryRunner.query(
            `CREATE TYPE "account_type" AS ENUM ('asset', 'liability', 'equity', 'income', 'expense')`,
        );
        await queryRunner.query(
            `CREATE TYPE "account_level" AS ENUM ('1', '2', '3', '4')`,
        );

        await queryRunner.createTable(
            new Table({
                name: 'accounts',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        default: 'gen_random_uuid()',
                    },
                    {
                        name: 'company_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'code',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'type',
                        type: 'enum',
                        enumName: 'account_type',
                        enum: ['asset', 'liability', 'equity', 'income', 'expense'],
                        isNullable: false,
                    },
                    {
                        name: 'level',
                        type: 'enum',
                        enumName: 'account_level',
                        enum: ['1', '2', '3', '4'],
                        isNullable: false,
                    },
                    {
                        name: 'parent_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'is_posting',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'is_active',
                        type: 'boolean',
                        default: true,
                    },
                    {
                        name: 'is_system',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'opening_balance',
                        type: 'numeric',
                        precision: 18,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'opening_balance_type',
                        type: 'varchar',
                        length: '6',
                        isNullable: true,
                    },
                    {
                        name: 'currency_code',
                        type: 'varchar',
                        length: '3',
                        isNullable: true,
                    },
                    {
                        name: 'allow_reconciliation',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'tax_category_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'sort_order',
                        type: 'integer',
                        default: 0,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'deleted_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                ],
            }),
            true,
        );

        // Foreign Keys
        await queryRunner.createForeignKey(
            'accounts',
            new TableForeignKey({
                columnNames: ['company_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'companies',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'accounts',
            new TableForeignKey({
                columnNames: ['parent_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'accounts',
                onDelete: 'RESTRICT',
            }),
        );

        await queryRunner.createForeignKey(
            'accounts',
            new TableForeignKey({
                columnNames: ['tax_category_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'tax_categories',
            }),
        );

        // Constraints
        await queryRunner.query(
            `ALTER TABLE "accounts" ADD CONSTRAINT "uq_account_code" UNIQUE (company_id, code)`,
        );

        await queryRunner.query(
            `ALTER TABLE "accounts" ADD CONSTRAINT "chk_posting_level" CHECK (
        (level = '4' AND is_posting = TRUE) OR
        (level IN ('1', '2', '3') AND is_posting = FALSE)
      )`,
        );

        await queryRunner.query(
            `ALTER TABLE "accounts" ADD CONSTRAINT "chk_opening_balance_type" CHECK (opening_balance_type IN ('debit', 'credit'))`,
        );

        // Indexes
        await queryRunner.createIndex(
            'accounts',
            new TableIndex({
                name: 'idx_accounts_company',
                columnNames: ['company_id'],
            }),
        );

        await queryRunner.createIndex(
            'accounts',
            new TableIndex({
                name: 'idx_accounts_type',
                columnNames: ['company_id', 'type'],
            }),
        );

        await queryRunner.createIndex(
            'accounts',
            new TableIndex({
                name: 'idx_accounts_parent',
                columnNames: ['parent_id'],
            }),
        );

        await queryRunner.createIndex(
            'accounts',
            new TableIndex({
                name: 'idx_accounts_posting',
                columnNames: ['company_id', 'is_posting'],
                where: 'is_posting = TRUE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('accounts');
        await queryRunner.query(`DROP TYPE "account_level"`);
        await queryRunner.query(`DROP TYPE "account_type"`);
    }
}
