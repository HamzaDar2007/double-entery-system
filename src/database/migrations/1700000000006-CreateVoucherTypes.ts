import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
} from 'typeorm';

export class CreateVoucherTypes1700000000006 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "voucher_nature" AS ENUM (
        'payment', 'receipt', 'journal', 'contra',
        'sales', 'purchase', 'credit_note', 'debit_note', 'opening'
      )`,
        );

        await queryRunner.createTable(
            new Table({
                name: 'voucher_types',
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
                        length: '10',
                        isNullable: false,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    },
                    {
                        name: 'nature',
                        type: 'enum',
                        enumName: 'voucher_nature',
                        enum: [
                            'payment',
                            'receipt',
                            'journal',
                            'contra',
                            'sales',
                            'purchase',
                            'credit_note',
                            'debit_note',
                            'opening',
                        ],
                        isNullable: false,
                    },
                    {
                        name: 'auto_numbering',
                        type: 'boolean',
                        default: true,
                    },
                    {
                        name: 'prefix',
                        type: 'varchar',
                        length: '20',
                        isNullable: true,
                    },
                    {
                        name: 'next_sequence',
                        type: 'bigint',
                        default: 1,
                    },
                    {
                        name: 'reset_frequency',
                        type: 'varchar',
                        length: '20',
                        default: "'yearly'",
                    },
                    {
                        name: 'requires_approval',
                        type: 'boolean',
                        default: false,
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
            'voucher_types',
            new TableForeignKey({
                columnNames: ['company_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'companies',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.query(
            `ALTER TABLE "voucher_types" ADD CONSTRAINT "uq_voucher_type" UNIQUE (company_id, code)`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('voucher_types');
        await queryRunner.query(`DROP TYPE "voucher_nature"`);
    }
}
