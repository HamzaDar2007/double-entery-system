import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAccountLevelAndRollup1733400000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add level column if it doesn't exist
        await queryRunner.query(`
            ALTER TABLE accounts 
            ADD COLUMN IF NOT EXISTS level VARCHAR(1) DEFAULT '4'
        `);

        // Add is_posting column if it doesn't exist (only L4 accounts can have transactions)
        await queryRunner.query(`
            ALTER TABLE accounts 
            ADD COLUMN IF NOT EXISTS is_posting BOOLEAN DEFAULT false
        `);

        // Add current_balance column if it doesn't exist (for rollup calculations)
        await queryRunner.query(`
            ALTER TABLE accounts 
            ADD COLUMN IF NOT EXISTS current_balance NUMERIC(18,2) DEFAULT 0
        `);

        // Add opening_balance_type column if it doesn't exist
        await queryRunner.query(`
            ALTER TABLE accounts 
            ADD COLUMN IF NOT EXISTS opening_balance_type VARCHAR(6)
        `);

        // Create index on level for faster queries
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_accounts_level ON accounts(level)
        `);

        // Create index on parent_id for hierarchy queries
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_accounts_parent_id ON accounts(parent_id)
        `);

        // Create a view for account hierarchy
        await queryRunner.query(`
            CREATE OR REPLACE VIEW account_hierarchy AS
            WITH RECURSIVE account_tree AS (
                -- Base case: L1 accounts (no parent)
                SELECT 
                    id,
                    code,
                    name,
                    type,
                    level,
                    parent_id,
                    company_id,
                    current_balance,
                    is_posting,
                    ARRAY[code] as path,
                    code as full_code,
                    1 as depth
                FROM accounts
                WHERE parent_id IS NULL AND deleted_at IS NULL
                
                UNION ALL
                
                -- Recursive case: child accounts
                SELECT 
                    a.id,
                    a.code,
                    a.name,
                    a.type,
                    a.level,
                    a.parent_id,
                    a.company_id,
                    a.current_balance,
                    a.is_posting,
                    at.path || a.code,
                    at.full_code || '.' || a.code,
                    at.depth + 1
                FROM accounts a
                INNER JOIN account_tree at ON a.parent_id = at.id
                WHERE a.deleted_at IS NULL
            )
            SELECT * FROM account_tree
            ORDER BY full_code
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP VIEW IF EXISTS account_hierarchy`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_accounts_parent_id`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_accounts_level`);
        await queryRunner.query(`ALTER TABLE accounts DROP COLUMN IF EXISTS opening_balance_type`);
        await queryRunner.query(`ALTER TABLE accounts DROP COLUMN IF EXISTS current_balance`);
        await queryRunner.query(`ALTER TABLE accounts DROP COLUMN IF EXISTS is_posting`);
        await queryRunner.query(`ALTER TABLE accounts DROP COLUMN IF EXISTS level`);
    }
}
