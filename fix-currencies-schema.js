const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'lab-accounts',
    user: 'postgres',
    password: 'postgres',
});

async function fixCurrenciesTable() {
    try {
        await client.connect();
        console.log('Connected to database\n');

        // Add deleted_at column if it doesn't exist
        await client.query(`
            ALTER TABLE currencies 
            ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL
        `);
        console.log('✅ Added deleted_at column to currencies table');

        await client.query(`
            ALTER TABLE exchange_rates 
            ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL
        `);
        console.log('✅ Added deleted_at column to exchange_rates table');

        console.log('\n✅ All done!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
    }
}

fixCurrenciesTable();
