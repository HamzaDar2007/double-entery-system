import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class FixItemsTable1700000000021 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Rename code to item_code
        await queryRunner.renameColumn('items', 'code', 'item_code');

        // Rename unit_price to sales_price
        await queryRunner.renameColumn('items', 'unit_price', 'sales_price');

        // Add missing columns
        await queryRunner.addColumn(
            'items',
            new TableColumn({
                name: 'purchase_price',
                type: 'numeric',
                precision: 18,
                scale: 2,
                default: 0,
            }),
        );

        await queryRunner.addColumn(
            'items',
            new TableColumn({
                name: 'unit_of_measure',
                type: 'varchar',
                length: '20',
                default: "'pcs'",
            }),
        );

        await queryRunner.addColumn(
            'items',
            new TableColumn({
                name: 'is_inventory_item',
                type: 'boolean',
                default: false,
            }),
        );

        await queryRunner.addColumn(
            'items',
            new TableColumn({
                name: 'current_stock',
                type: 'numeric',
                precision: 18,
                scale: 4,
                default: 0,
            }),
        );

        await queryRunner.addColumn(
            'items',
            new TableColumn({
                name: 'reorder_level',
                type: 'numeric',
                precision: 18,
                scale: 4,
                default: 0,
            }),
        );

        await queryRunner.addColumn(
            'items',
            new TableColumn({
                name: 'barcode',
                type: 'varchar',
                length: '100',
                isNullable: true,
            }),
        );

        await queryRunner.addColumn(
            'items',
            new TableColumn({
                name: 'sku',
                type: 'varchar',
                length: '100',
                isNullable: true,
            }),
        );

        await queryRunner.addColumn(
            'items',
            new TableColumn({
                name: 'category',
                type: 'varchar',
                length: '50',
                isNullable: true,
            }),
        );

        await queryRunner.addColumn(
            'items',
            new TableColumn({
                name: 'brand',
                type: 'varchar',
                length: '50',
                isNullable: true,
            }),
        );

        // Add sales_tax_category_id column
        await queryRunner.addColumn(
            'items',
            new TableColumn({
                name: 'sales_tax_category_id',
                type: 'uuid',
                isNullable: true,
            }),
        );

        // Add purchase_tax_category_id column
        await queryRunner.addColumn(
            'items',
            new TableColumn({
                name: 'purchase_tax_category_id',
                type: 'uuid',
                isNullable: true,
            }),
        );

        // Add inventory_account_id column
        await queryRunner.addColumn(
            'items',
            new TableColumn({
                name: 'inventory_account_id',
                type: 'uuid',
                isNullable: true,
            }),
        );

        // Add missing updated_at and deleted_at columns
        await queryRunner.addColumn(
            'items',
            new TableColumn({
                name: 'updated_at',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
            }),
        );

        await queryRunner.addColumn(
            'items',
            new TableColumn({
                name: 'deleted_at',
                type: 'timestamp',
                isNullable: true,
            }),
        );

        // Drop the old type column as it's not used in the entity
        await queryRunner.dropColumn('items', 'type');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverse all changes
        await queryRunner.addColumn(
            'items',
            new TableColumn({
                name: 'type',
                type: 'varchar',
                length: '20',
                default: "'service'",
            }),
        );

        await queryRunner.dropColumn('items', 'deleted_at');
        await queryRunner.dropColumn('items', 'updated_at');
        await queryRunner.dropColumn('items', 'inventory_account_id');
        await queryRunner.dropColumn('items', 'purchase_tax_category_id');
        await queryRunner.dropColumn('items', 'sales_tax_category_id');
        await queryRunner.dropColumn('items', 'brand');
        await queryRunner.dropColumn('items', 'category');
        await queryRunner.dropColumn('items', 'sku');
        await queryRunner.dropColumn('items', 'barcode');
        await queryRunner.dropColumn('items', 'reorder_level');
        await queryRunner.dropColumn('items', 'current_stock');
        await queryRunner.dropColumn('items', 'is_inventory_item');
        await queryRunner.dropColumn('items', 'unit_of_measure');
        await queryRunner.dropColumn('items', 'purchase_price');

        await queryRunner.renameColumn('items', 'sales_price', 'unit_price');
        await queryRunner.renameColumn('items', 'item_code', 'code');
    }
}