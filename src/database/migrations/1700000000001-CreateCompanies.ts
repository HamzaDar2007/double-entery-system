import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateCompanies1700000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

        await queryRunner.createTable(
            new Table({
                name: 'companies',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        default: 'gen_random_uuid()',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'legal_name',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'registration_no',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                    },
                    {
                        name: 'tax_registration_no',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                    },
                    {
                        name: 'country_code',
                        type: 'varchar',
                        length: '3',
                        isNullable: false,
                    },
                    {
                        name: 'currency_code',
                        type: 'varchar',
                        length: '3',
                        isNullable: false,
                    },
                    {
                        name: 'fiscal_year_start_month',
                        type: 'integer',
                        default: 1,
                    },
                    {
                        name: 'address',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'phone',
                        type: 'varchar',
                        length: '50',
                        isNullable: true,
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'logo_url',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'is_active',
                        type: 'boolean',
                        default: true,
                    },
                    {
                        name: 'settings',
                        type: 'jsonb',
                        default: "'{}'",
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

        await queryRunner.query(
            `ALTER TABLE "companies" ADD CONSTRAINT "chk_fiscal_month" CHECK (fiscal_year_start_month BETWEEN 1 AND 12)`,
        );

        await queryRunner.createIndex(
            'companies',
            new TableIndex({
                name: 'idx_companies_active',
                columnNames: ['is_active'],
                where: 'deleted_at IS NULL',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex('companies', 'idx_companies_active');
        await queryRunner.dropTable('companies');
    }
}
