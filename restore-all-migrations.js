const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'lab-accounts',
    user: 'postgres',
    password: 'postgres',
});

async function restoreAllMigrations() {
    try {
        await client.connect();
        console.log('✅ Connected to database\n');

        // All 25 migrations (18 original + 7 new)
        const allMigrations = [
            // Original 18 migrations
            { timestamp: 1700000000001, name: 'CreateCompanies1700000000001' },
            { timestamp: 1700000000002, name: 'CreateUsers1700000000002' },
            { timestamp: 1700000000003, name: 'CreateFiscalYears1700000000003' },
            { timestamp: 1700000000004, name: 'CreateTaxCategories1700000000004' },
            { timestamp: 1700000000005, name: 'CreateAccounts1700000000005' },
            { timestamp: 1700000000006, name: 'CreateVoucherTypes1700000000006' },
            { timestamp: 1700000000007, name: 'CreateJournalEntries1700000000007' },
            { timestamp: 1700000000008, name: 'CreateCostCenters1700000000008' },
            { timestamp: 1700000000009, name: 'CreateProjects1700000000009' },
            { timestamp: 1700000000010, name: 'CreateCustomers1700000000010' },
            { timestamp: 1700000000011, name: 'CreateSuppliers1700000000011' },
            { timestamp: 1700000000012, name: 'CreateReconciliations1700000000012' },
            { timestamp: 1700000000013, name: 'CreateJournalEntryLines1700000000013' },
            { timestamp: 1700000000014, name: 'CreateInvoices1700000000014' },
            { timestamp: 1700000000015, name: 'CreateItems1700000000015' },
            { timestamp: 1700000000016, name: 'CreateInvoiceLines1700000000016' },
            { timestamp: 1700000000017, name: 'CreateAccountBalances1700000000017' },
            { timestamp: 1700000000018, name: 'CreateTriggers1700000000018' },

            // New 7 migrations
            { timestamp: 1000000000000, name: 'CompleteSchema1000000000000' },
            { timestamp: 1700000000019, name: 'FixReconciliationsTable1700000000019' },
            { timestamp: 1700000000020, name: 'CreateBudgetsTable1700000000020' },
            { timestamp: 1700000000021, name: 'FixItemsTable1700000000021' },
            { timestamp: 1733248000000, name: 'AddMissingColumns1733248000000' },
            { timestamp: 1733400000000, name: 'AddAccountLevelAndRollup1733400000000' },
            { timestamp: 1764764646470, name: 'UpdateProjectsTable1764764646470' },
        ];

        console.log('🔧 Restoring all migrations...\n');

        for (const migration of allMigrations) {
            // Check if already exists
            const check = await client.query(
                'SELECT * FROM migrations_history WHERE name = $1',
                [migration.name]
            );

            if (check.rows.length > 0) {
                console.log(`  ⏭️  ${migration.name} - already exists`);
                continue;
            }

            // Insert into migrations_history
            await client.query(
                `INSERT INTO migrations_history (timestamp, name) VALUES ($1, $2)`,
                [migration.timestamp, migration.name]
            );
            console.log(`  ✅ ${migration.name} - restored`);
        }

        // Verify count
        const all = await client.query(
            'SELECT COUNT(*) as count FROM migrations_history'
        );
        console.log(`\n✅ Total migrations in database: ${all.rows[0].count}`);
        console.log('✅ All migrations restored successfully!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
    }
}

restoreAllMigrations();
