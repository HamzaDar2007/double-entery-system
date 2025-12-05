const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'lab-accounts',
    user: 'postgres',
    password: 'postgres',
});

async function markMigrationsAsExecuted() {
    try {
        await client.connect();
        console.log('✅ Connected to database\n');

        // Check existing migrations
        const existing = await client.query(
            'SELECT name FROM migrations_history ORDER BY timestamp DESC'
        );
        console.log('Existing migrations:');
        existing.rows.forEach((row, i) => {
            console.log(`  ${i + 1}. ${row.name}`);
        });

        // Migrations to mark as executed (these try to create tables that already exist)
        const migrationsToMark = [
            { timestamp: 1000000000000, name: 'CompleteSchema1000000000000' },
            { timestamp: 1733248000000, name: 'AddMissingColumns1733248000000' },
            { timestamp: 1733400000000, name: 'AddAccountLevelAndRollup1733400000000' },
        ];

        console.log('\n🔧 Marking migrations as executed...\n');

        for (const migration of migrationsToMark) {
            // Check if already exists
            const check = await client.query(
                'SELECT * FROM migrations_history WHERE name = $1',
                [migration.name]
            );

            if (check.rows.length > 0) {
                console.log(`  ⏭️  ${migration.name} - already marked`);
                continue;
            }

            // Insert into migrations_history
            await client.query(
                `INSERT INTO migrations_history (timestamp, name) VALUES ($1, $2)`,
                [migration.timestamp, migration.name]
            );
            console.log(`  ✅ ${migration.name} - marked as executed`);
        }

        console.log('\n✅ All migrations marked successfully!');
        console.log('\nYou can now run: npm run migration:run');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
    }
}

markMigrationsAsExecuted();
