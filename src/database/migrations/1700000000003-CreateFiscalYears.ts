import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
    TableIndex,
} from 'typeorm';

export class CreateFiscalYears1700000000003 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'fiscal_years',
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
                        name: 'year_name',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                    },
                    {
                        name: 'start_date',
                        type: 'date',
                        isNullable: false,
                    },
                    {
                        name: 'end_date',
                        type: 'date',
                        isNullable: false,
                    },
                    {
                        name: 'is_closed',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'closed_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'closed_by',
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
            'fiscal_years',
            new TableForeignKey({
                columnNames: ['company_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'companies',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'fiscal_years',
            new TableForeignKey({
                columnNames: ['closed_by'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
            }),
        );

        await queryRunner.query(
            `ALTER TABLE "fiscal_years" ADD CONSTRAINT "chk_date_range" CHECK (end_date > start_date)`,
        );

        await queryRunner.query(
            `ALTER TABLE "fiscal_years" ADD CONSTRAINT "uq_fiscal_year" UNIQUE (company_id, year_name)`,
        );

        await queryRunner.createIndex(
            'fiscal_years',
            new TableIndex({
                name: 'idx_fiscal_years_company',
                columnNames: ['company_id', 'start_date'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('fiscal_years');
    }
}
