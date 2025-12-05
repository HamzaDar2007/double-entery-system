const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'lab-accounts',
    user: 'postgres',
    password: 'postgres',
});

async function runMigration() {
    try {
        await client.connect();
        console.log('✅ Connected to database\n');

        // Add level column
        await client.query(`
            ALTER TABLE accounts 
            ADD COLUMN IF NOT EXISTS level VARCHAR(1) DEFAULT '4'
        `);
        console.log('✅ Added level column');

        // Add is_posting column
        await client.query(`
            ALTER TABLE accounts 
            ADD COLUMN IF NOT EXISTS is_posting BOOLEAN DEFAULT false
        `);
        console.log('✅ Added is_posting column');

        // Add current_balance column
        await client.query(`
            ALTER TABLE accounts 
            ADD COLUMN IF NOT EXISTS current_balance NUMERIC(18,2) DEFAULT 0
        `);
        console.log('✅ Added current_balance column');

        // Create indexes
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_accounts_level ON accounts(level)
        `);
        console.log('✅ Created index on level');

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_accounts_parent_id ON accounts(parent_id)
        `);
        console.log('✅ Created index on parent_id');

        console.log('\n✅ Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
    } finally {
        await client.end();
    }
}

runMigration();
