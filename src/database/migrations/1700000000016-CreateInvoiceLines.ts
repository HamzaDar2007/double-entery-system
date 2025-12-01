import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
    TableIndex,
} from 'typeorm';

export class CreateInvoiceLines1700000000016 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'invoice_lines',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        default: 'gen_random_uuid()',
                    },
                    {
                        name: 'invoice_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'line_no',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'item_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'quantity',
                        type: 'numeric',
                        precision: 18,
                        scale: 4,
                        default: 1,
                    },
                    {
                        name: 'unit_price',
                        type: 'numeric',
                        precision: 18,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: 'discount_percent',
                        type: 'numeric',
                        precision: 5,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'discount_amount',
                        type: 'numeric',
                        precision: 18,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'tax_percent',
                        type: 'numeric',
                        precision: 5,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'tax_amount',
                        type: 'numeric',
                        precision: 18,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'line_total',
                        type: 'numeric',
                        precision: 18,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: 'account_id',
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

        await queryRunner.createForeignKey(
            'invoice_lines',
            new TableForeignKey({
                columnNames: ['invoice_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'invoices',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'invoice_lines',
            new TableForeignKey({
                columnNames: ['item_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'items',
            }),
        );

        await queryRunner.createForeignKey(
            'invoice_lines',
            new TableForeignKey({
                columnNames: ['account_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'accounts',
            }),
        );

        await queryRunner.query(
            `ALTER TABLE "invoice_lines" ADD CONSTRAINT "uq_invoice_line" UNIQUE (invoice_id, line_no)`,
        );

        await queryRunner.createIndex(
            'invoice_lines',
            new TableIndex({
                name: 'idx_invoice_lines_invoice',
                columnNames: ['invoice_id'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('invoice_lines');
    }
}
