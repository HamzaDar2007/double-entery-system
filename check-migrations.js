const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'lab-accounts',
    user: 'postgres',
    password: 'postgres',
});

async function checkMigrations() {
    try {
        await client.connect();
        console.log('✅ Connected to database\n');

        // Get all migrations
        const result = await client.query(
            'SELECT id, timestamp, name FROM migrations_history ORDER BY timestamp ASC'
        );

        console.log(`Total migrations: ${result.rows.length}\n`);
        console.log('All migrations:');
        result.rows.forEach((row, i) => {
            console.log(`  ${i + 1}. [${row.timestamp}] ${row.name}`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
    }
}

checkMigrations();
