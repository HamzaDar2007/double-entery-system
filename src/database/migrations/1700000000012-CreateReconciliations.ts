import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
} from 'typeorm';

export class CreateReconciliations1700000000012 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'reconciliations',
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
                        name: 'account_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'statement_date',
                        type: 'date',
                        isNullable: false,
                    },
                    {
                        name: 'statement_balance',
                        type: 'numeric',
                        precision: 18,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: 'book_balance',
                        type: 'numeric',
                        precision: 18,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: 'difference',
                        type: 'numeric',
                        precision: 18,
                        scale: 2,
                        generatedType: 'STORED',
                        asExpression: 'statement_balance - book_balance',
                    },
                    {
                        name: 'is_reconciled',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'reconciled_by',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'reconciled_at',
                        type: 'timestamp',
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
            'reconciliations',
            new TableForeignKey({
                columnNames: ['company_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'companies',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'reconciliations',
            new TableForeignKey({
                columnNames: ['account_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'accounts',
            }),
        );

        await queryRunner.createForeignKey(
            'reconciliations',
            new TableForeignKey({
                columnNames: ['reconciled_by'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('reconciliations');
    }
}
