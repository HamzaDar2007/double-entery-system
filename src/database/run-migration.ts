import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

async function runMigration() {
    const client = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'financial_system',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
    });

    try {
        await client.connect();
        console.log('Connected to database');

        const sqlFile = path.join(__dirname, 'migrations', 'add-missing-columns.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        console.log('Running migration...');
        await client.query(sql);
        console.log('✅ Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await client.end();
    }
}

runMigration();
