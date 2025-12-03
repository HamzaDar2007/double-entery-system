import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
} from 'typeorm';

export class CreateBudgetsTable1700000000020 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'budgets',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        default: 'gen_random_uuid()',
                    },
                    {
                        name: 'account_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'fiscal_year_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'amount',
                        type: 'decimal',
                        precision: 18,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: 'period',
                        type: 'varchar',
                        length: '20',
                        isNullable: true,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
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

        await queryRunner.createForeignKey(
            'budgets',
            new TableForeignKey({
                columnNames: ['account_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'accounts',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'budgets',
            new TableForeignKey({
                columnNames: ['fiscal_year_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'fiscal_years',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('budgets');
    }
}