import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
    TableIndex,
} from 'typeorm';

export class CreateInvoices1700000000014 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "invoice_type" AS ENUM ('sales', 'purchase')`,
        );
        await queryRunner.query(
            `CREATE TYPE "invoice_status" AS ENUM ('draft', 'issued', 'partially_paid', 'paid', 'overdue', 'cancelled')`,
        );

        await queryRunner.createTable(
            new Table({
                name: 'invoices',
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
                        name: 'invoice_type',
                        type: 'enum',
                        enumName: 'invoice_type',
                        enum: ['sales', 'purchase'],
                        isNullable: false,
                    },
                    {
                        name: 'invoice_no',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                    },
                    {
                        name: 'invoice_date',
                        type: 'date',
                        isNullable: false,
                    },
                    {
                        name: 'due_date',
                        type: 'date',
                        isNullable: false,
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
                        name: 'currency_code',
                        type: 'varchar',
                        length: '3',
                        isNullable: false,
                    },
                    {
                        name: 'exchange_rate',
                        type: 'numeric',
                        precision: 18,
                        scale: 6,
                        default: 1,
                    },
                    {
                        name: 'subtotal',
                        type: 'numeric',
                        precision: 18,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: 'discount_amount',
                        type: 'numeric',
                        precision: 18,
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
                        name: 'total_amount',
                        type: 'numeric',
                        precision: 18,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: 'paid_amount',
                        type: 'numeric',
                        precision: 18,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'balance_amount',
                        type: 'numeric',
                        precision: 18,
                        scale: 2,
                        generatedType: 'STORED',
                        asExpression: 'total_amount - paid_amount',
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enumName: 'invoice_status',
                        enum: [
                            'draft',
                            'issued',
                            'partially_paid',
                            'paid',
                            'overdue',
                            'cancelled',
                        ],
                        default: "'draft'",
                    },
                    {
                        name: 'voucher_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'payment_terms',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'notes',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'terms_conditions',
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
            'invoices',
            new TableForeignKey({
                columnNames: ['company_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'companies',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'invoices',
            new TableForeignKey({
                columnNames: ['customer_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'customers',
            }),
        );

        await queryRunner.createForeignKey(
            'invoices',
            new TableForeignKey({
                columnNames: ['supplier_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'suppliers',
            }),
        );

        await queryRunner.createForeignKey(
            'invoices',
            new TableForeignKey({
                columnNames: ['voucher_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'journal_entries',
            }),
        );

        await queryRunner.createForeignKey(
            'invoices',
            new TableForeignKey({
                columnNames: ['created_by'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
            }),
        );

        // Constraints
        await queryRunner.query(
            `ALTER TABLE "invoices" ADD CONSTRAINT "uq_invoice_no" UNIQUE (company_id, invoice_no)`,
        );

        await queryRunner.query(
            `ALTER TABLE "invoices" ADD CONSTRAINT "chk_customer_or_supplier" CHECK (
        (invoice_type = 'sales' AND customer_id IS NOT NULL) OR
        (invoice_type = 'purchase' AND supplier_id IS NOT NULL)
      )`,
        );

        // Indexes
        await queryRunner.createIndex(
            'invoices',
            new TableIndex({
                name: 'idx_invoices_company',
                columnNames: ['company_id', 'invoice_date'],
            }),
        );

        await queryRunner.createIndex(
            'invoices',
            new TableIndex({
                name: 'idx_invoices_customer',
                columnNames: ['customer_id'],
            }),
        );

        await queryRunner.createIndex(
            'invoices',
            new TableIndex({
                name: 'idx_invoices_supplier',
                columnNames: ['supplier_id'],
            }),
        );

        await queryRunner.createIndex(
            'invoices',
            new TableIndex({
                name: 'idx_invoices_status',
                columnNames: ['company_id', 'status'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('invoices');
        await queryRunner.query(`DROP TYPE "invoice_status"`);
        await queryRunner.query(`DROP TYPE "invoice_type"`);
    }
}
