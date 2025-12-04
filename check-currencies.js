const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'lab-accounts',
    user: 'postgres',
    password: 'postgres',
});

async function checkTables() {
    try {
        await client.connect();
        console.log('Connected to database\n');

        // Check if currencies table exists
        const result = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('currencies', 'exchange_rates')
            ORDER BY table_name
        `);

        console.log('Tables found:');
        result.rows.forEach(row => {
            console.log(`  ✅ ${row.table_name}`);
        });

        if (result.rows.length === 0) {
            console.log('  ❌ No currencies tables found!');
        }

        // Check currencies data
        const currenciesCount = await client.query('SELECT COUNT(*) FROM currencies');
        console.log(`\nCurrencies in database: ${currenciesCount.rows[0].count}`);

        const currencies = await client.query('SELECT code, name, symbol, is_base FROM currencies ORDER BY code');
        console.log('\nCurrency list:');
        currencies.rows.forEach(curr => {
            console.log(`  ${curr.code} - ${curr.name} (${curr.symbol}) ${curr.is_base ? '[BASE]' : ''}`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
    }
}

checkTables();
