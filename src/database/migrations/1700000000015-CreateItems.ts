import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
} from 'typeorm';

export class CreateItems1700000000015 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'items',
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
                        type: 'varchar',
                        length: '20',
                        default: "'service'",
                    },
                    {
                        name: 'unit_price',
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
                        name: 'sales_account_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'purchase_account_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'is_active',
                        type: 'boolean',
                        default: true,
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
            'items',
            new TableForeignKey({
                columnNames: ['company_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'companies',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'items',
            new TableForeignKey({
                columnNames: ['tax_category_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'tax_categories',
            }),
        );

        await queryRunner.createForeignKey(
            'items',
            new TableForeignKey({
                columnNames: ['sales_account_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'accounts',
            }),
        );

        await queryRunner.createForeignKey(
            'items',
            new TableForeignKey({
                columnNames: ['purchase_account_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'accounts',
            }),
        );

        await queryRunner.query(
            `ALTER TABLE "items" ADD CONSTRAINT "uq_item_code" UNIQUE (company_id, code)`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('items');
    }
}
