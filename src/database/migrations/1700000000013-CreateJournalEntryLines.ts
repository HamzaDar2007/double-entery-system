import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
    TableIndex,
} from 'typeorm';

export class CreateJournalEntryLines1700000000013 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'journal_entry_lines',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        default: 'gen_random_uuid()',
                    },
                    {
                        name: 'journal_entry_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'line_no',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'account_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'debit',
                        type: 'numeric',
                        precision: 18,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'credit',
                        type: 'numeric',
                        precision: 18,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'cost_center_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'project_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'customer_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'supplier_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'tax_amount',
                        type: 'numeric',
                        precision: 18,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'tax_category_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'reconciliation_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        // Foreign Keys
        await queryRunner.createForeignKey(
            'journal_entry_lines',
            new TableForeignKey({
                columnNames: ['journal_entry_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'journal_entries',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'journal_entry_lines',
            new TableForeignKey({
                columnNames: ['account_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'accounts',
                onDelete: 'RESTRICT',
            }),
        );

        await queryRunner.createForeignKey(
            'journal_entry_lines',
            new TableForeignKey({
                columnNames: ['cost_center_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'cost_centers',
            }),
        );

        await queryRunner.createForeignKey(
            'journal_entry_lines',
            new TableForeignKey({
                columnNames: ['project_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'projects',
            }),
        );

        await queryRunner.createForeignKey(
            'journal_entry_lines',
            new TableForeignKey({
                columnNames: ['customer_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'customers',
            }),
        );

        await queryRunner.createForeignKey(
            'journal_entry_lines',
            new TableForeignKey({
                columnNames: ['supplier_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'suppliers',
            }),
        );

        await queryRunner.createForeignKey(
            'journal_entry_lines',
            new TableForeignKey({
                columnNames: ['tax_category_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'tax_categories',
            }),
        );

        await queryRunner.createForeignKey(
            'journal_entry_lines',
            new TableForeignKey({
                columnNames: ['reconciliation_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'reconciliations',
            }),
        );

        // Constraints
        await queryRunner.query(
            `ALTER TABLE "journal_entry_lines" ADD CONSTRAINT "chk_debit_positive" CHECK (debit >= 0)`,
        );
        await queryRunner.query(
            `ALTER TABLE "journal_entry_lines" ADD CONSTRAINT "chk_credit_positive" CHECK (credit >= 0)`,
        );

        await queryRunner.query(
            `ALTER TABLE "journal_entry_lines" ADD CONSTRAINT "chk_debit_credit" CHECK (
        (debit > 0 AND credit = 0) OR
        (credit > 0 AND debit = 0) OR
        (debit = 0 AND credit = 0)
      )`,
        );

        await queryRunner.query(
            `ALTER TABLE "journal_entry_lines" ADD CONSTRAINT "uq_line_no" UNIQUE (journal_entry_id, line_no)`,
        );

        // Indexes
        await queryRunner.createIndex(
            'journal_entry_lines',
            new TableIndex({
                name: 'idx_journal_lines_entry',
                columnNames: ['journal_entry_id'],
            }),
        );

        await queryRunner.createIndex(
            'journal_entry_lines',
            new TableIndex({
                name: 'idx_journal_lines_account',
                columnNames: ['account_id'],
            }),
        );

        await queryRunner.createIndex(
            'journal_entry_lines',
            new TableIndex({
                name: 'idx_journal_lines_cost_center',
                columnNames: ['cost_center_id'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('journal_entry_lines');
    }
}
