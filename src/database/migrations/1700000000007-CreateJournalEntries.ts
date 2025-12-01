import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
    TableIndex,
} from 'typeorm';

export class CreateJournalEntries1700000000007 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "entry_status" AS ENUM ('draft', 'pending_approval', 'approved', 'posted', 'cancelled', 'reversed')`,
        );

        await queryRunner.createTable(
            new Table({
                name: 'journal_entries',
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
                        name: 'fiscal_year_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'voucher_type_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'voucher_no',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                    },
                    {
                        name: 'entry_date',
                        type: 'date',
                        isNullable: false,
                    },
                    {
                        name: 'posting_date',
                        type: 'date',
                        isNullable: false,
                    },
                    {
                        name: 'reference',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'source_module',
                        type: 'varchar',
                        length: '50',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enumName: 'entry_status',
                        enum: [
                            'draft',
                            'pending_approval',
                            'approved',
                            'posted',
                            'cancelled',
                            'reversed',
                        ],
                        default: "'draft'",
                    },
                    {
                        name: 'posted',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'posted_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'posted_by',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'approved_by',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'approved_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'reversed_by_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'reversal_of_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'attachment_urls',
                        type: 'text',
                        isArray: true,
                        isNullable: true,
                    },
                    {
                        name: 'notes',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'created_by',
                        type: 'uuid',
                        isNullable: false,
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
                ],
            }),
            true,
        );

        // Foreign Keys
        await queryRunner.createForeignKey(
            'journal_entries',
            new TableForeignKey({
                columnNames: ['company_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'companies',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'journal_entries',
            new TableForeignKey({
                columnNames: ['fiscal_year_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'fiscal_years',
            }),
        );

        await queryRunner.createForeignKey(
            'journal_entries',
            new TableForeignKey({
                columnNames: ['voucher_type_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'voucher_types',
            }),
        );

        await queryRunner.createForeignKey(
            'journal_entries',
            new TableForeignKey({
                columnNames: ['created_by'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
            }),
        );

        await queryRunner.createForeignKey(
            'journal_entries',
            new TableForeignKey({
                columnNames: ['posted_by'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
            }),
        );

        await queryRunner.createForeignKey(
            'journal_entries',
            new TableForeignKey({
                columnNames: ['approved_by'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
            }),
        );

        await queryRunner.createForeignKey(
            'journal_entries',
            new TableForeignKey({
                columnNames: ['reversed_by_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'journal_entries',
            }),
        );

        await queryRunner.createForeignKey(
            'journal_entries',
            new TableForeignKey({
                columnNames: ['reversal_of_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'journal_entries',
            }),
        );

        // Constraints
        await queryRunner.query(
            `ALTER TABLE "journal_entries" ADD CONSTRAINT "uq_voucher_no" UNIQUE (company_id, voucher_no)`,
        );

        await queryRunner.query(
            `ALTER TABLE "journal_entries" ADD CONSTRAINT "chk_posted" CHECK ((posted = TRUE AND posted_at IS NOT NULL) OR (posted = FALSE))`,
        );

        // Indexes
        await queryRunner.createIndex(
            'journal_entries',
            new TableIndex({
                name: 'idx_journal_company_date',
                columnNames: ['company_id', 'entry_date'],
            }),
        );

        await queryRunner.createIndex(
            'journal_entries',
            new TableIndex({
                name: 'idx_journal_status',
                columnNames: ['company_id', 'status'],
            }),
        );

        await queryRunner.createIndex(
            'journal_entries',
            new TableIndex({
                name: 'idx_journal_voucher_type',
                columnNames: ['voucher_type_id'],
            }),
        );

        await queryRunner.createIndex(
            'journal_entries',
            new TableIndex({
                name: 'idx_journal_fiscal_year',
                columnNames: ['fiscal_year_id'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('journal_entries');
        await queryRunner.query(`DROP TYPE "entry_status"`);
    }
}
