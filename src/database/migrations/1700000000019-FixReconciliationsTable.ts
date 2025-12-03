import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class FixReconciliationsTable1700000000019 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add missing updated_at column
        await queryRunner.addColumn(
            'reconciliations',
            new TableColumn({
                name: 'updated_at',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
            }),
        );

        // Add missing deleted_at column
        await queryRunner.addColumn(
            'reconciliations',
            new TableColumn({
                name: 'deleted_at',
                type: 'timestamp',
                isNullable: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('reconciliations', 'updated_at');
        await queryRunner.dropColumn('reconciliations', 'deleted_at');
    }
}