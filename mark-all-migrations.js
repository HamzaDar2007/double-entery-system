const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'lab-accounts',
    user: 'postgres',
    password: 'postgres',
});

async function markAllPendingMigrations() {
    try {
        await client.connect();
        console.log('✅ Connected to database\n');

        // All migrations that need to be marked as executed
        const migrationsToMark = [
            { timestamp: 1000000000000, name: 'CompleteSchema1000000000000' },
            { timestamp: 1700000000019, name: 'FixReconciliationsTable1700000000019' },
            { timestamp: 1700000000020, name: 'CreateBudgetsTable1700000000020' },
            { timestamp: 1700000000021, name: 'FixItemsTable1700000000021' },
            { timestamp: 1733248000000, name: 'AddMissingColumns1733248000000' },
            { timestamp: 1733400000000, name: 'AddAccountLevelAndRollup1733400000000' },
            { timestamp: 1764764646470, name: 'UpdateProjectsTable1764764646470' },
        ];

        console.log('🔧 Marking all pending migrations as executed...\n');

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
            console.log(`  ✅ ${migration.name} - marked`);
        }

        // Verify all migrations
        const all = await client.query(
            'SELECT COUNT(*) as count FROM migrations_history'
        );
        console.log(`\n✅ Total migrations in history: ${all.rows[0].count}`);
        console.log('\n✅ All done! No more migration errors should occur.');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
    }
}

markAllPendingMigrations();
