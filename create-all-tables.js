const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'lab-accounts',
    user: 'postgres',
    password: 'postgres',
});

async function createAllTables() {
    try {
        await client.connect();
        console.log('✅ Connected to database\n');
        console.log('🔧 Creating all tables...\n');

        // Enable UUID extension
        await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        console.log('✅ UUID extension enabled');

        // Create all tables in order
        const tables = [
            // Companies table
            {
                name: 'companies',
                sql: `
                    CREATE TABLE IF NOT EXISTS companies (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        deleted_at TIMESTAMP NULL,
                        name VARCHAR NOT NULL,
                        email VARCHAR,
                        phone VARCHAR,
                        address TEXT,
                        tax_id VARCHAR,
                        currency VARCHAR NOT NULL DEFAULT 'USD',
                        fiscal_year_start_month INTEGER NOT NULL DEFAULT 1,
                        logo_url VARCHAR
                    )`
            },
            // Users table
            {
                name: 'users',
                sql: `
                    CREATE TABLE IF NOT EXISTS users (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        deleted_at TIMESTAMP NULL,
                        username VARCHAR NOT NULL UNIQUE,
                        email VARCHAR NOT NULL UNIQUE,
                        password VARCHAR NOT NULL,
                        role VARCHAR,
                        company_id UUID REFERENCES companies(id),
                        is_active BOOLEAN DEFAULT true
                    )`
            },
            // Fiscal Years
            {
                name: 'fiscal_years',
                sql: `
                    CREATE TABLE IF NOT EXISTS fiscal_years (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        deleted_at TIMESTAMP NULL,
                        company_id UUID NOT NULL REFERENCES companies(id),
                        name VARCHAR NOT NULL,
                        start_date DATE NOT NULL,
                        end_date DATE NOT NULL,
                        is_closed BOOLEAN DEFAULT false
                    )`
            },
            // Tax Categories
            {
                name: 'tax_categories',
                sql: `
                    CREATE TABLE IF NOT EXISTS tax_categories (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        deleted_at TIMESTAMP NULL,
                        company_id UUID NOT NULL REFERENCES companies(id),
                        name VARCHAR NOT NULL,
                        code VARCHAR NOT NULL,
                        rate NUMERIC(5,2) NOT NULL,
                        type VARCHAR NOT NULL,
                        is_active BOOLEAN DEFAULT true,
                        description TEXT
                    )`
            },
            // Accounts table
            {
                name: 'accounts',
                sql: `
                    CREATE TABLE IF NOT EXISTS accounts (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        deleted_at TIMESTAMP NULL,
                        company_id UUID NOT NULL REFERENCES companies(id),
                        code VARCHAR NOT NULL,
                        name VARCHAR NOT NULL,
                        description TEXT,
                        type VARCHAR NOT NULL,
                        level VARCHAR(1) DEFAULT '4',
                        parent_id UUID REFERENCES accounts(id),
                        is_posting BOOLEAN DEFAULT false,
                        is_active BOOLEAN DEFAULT true,
                        is_system BOOLEAN DEFAULT false,
                        opening_balance NUMERIC(18,2) DEFAULT 0,
                        opening_balance_type VARCHAR(6),
                        current_balance NUMERIC(18,2) DEFAULT 0,
                        currency_code VARCHAR(3),
                        allow_reconciliation BOOLEAN DEFAULT false,
                        tax_category_id UUID REFERENCES tax_categories(id),
                        sort_order INTEGER DEFAULT 0
                    )`
            },
            // Customers
            {
                name: 'customers',
                sql: `
                    CREATE TABLE IF NOT EXISTS customers (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        deleted_at TIMESTAMP NULL,
                        company_id UUID NOT NULL REFERENCES companies(id),
                        name VARCHAR NOT NULL,
                        email VARCHAR,
                        phone VARCHAR,
                        address TEXT,
                        tax_id VARCHAR,
                        credit_limit NUMERIC(18,2) DEFAULT 0,
                        payment_terms INTEGER DEFAULT 30,
                        is_active BOOLEAN DEFAULT true
                    )`
            },
            // Suppliers
            {
                name: 'suppliers',
                sql: `
                    CREATE TABLE IF NOT EXISTS suppliers (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        deleted_at TIMESTAMP NULL,
                        company_id UUID NOT NULL REFERENCES companies(id),
                        name VARCHAR NOT NULL,
                        email VARCHAR,
                        phone VARCHAR,
                        address TEXT,
                        tax_id VARCHAR,
                        payment_terms INTEGER DEFAULT 30,
                        is_active BOOLEAN DEFAULT true
                    )`
            },
            // Cost Centers
            {
                name: 'cost_centers',
                sql: `
                    CREATE TABLE IF NOT EXISTS cost_centers (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        deleted_at TIMESTAMP NULL,
                        company_id UUID NOT NULL REFERENCES companies(id),
                        code VARCHAR NOT NULL,
                        name VARCHAR NOT NULL,
                        parent_id UUID REFERENCES cost_centers(id),
                        is_active BOOLEAN DEFAULT true
                    )`
            },
            // Projects
            {
                name: 'projects',
                sql: `
                    CREATE TABLE IF NOT EXISTS projects (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        deleted_at TIMESTAMP NULL,
                        company_id UUID NOT NULL REFERENCES companies(id),
                        code VARCHAR NOT NULL,
                        name VARCHAR NOT NULL,
                        description TEXT,
                        start_date DATE,
                        end_date DATE,
                        budget NUMERIC(18,2) DEFAULT 0,
                        is_active BOOLEAN DEFAULT true
                    )`
            },
            // Items
            {
                name: 'items',
                sql: `
                    CREATE TABLE IF NOT EXISTS items (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        deleted_at TIMESTAMP NULL,
                        company_id UUID NOT NULL REFERENCES companies(id),
                        code VARCHAR NOT NULL,
                        name VARCHAR NOT NULL,
                        description TEXT,
                        unit VARCHAR,
                        purchase_price NUMERIC(18,2) DEFAULT 0,
                        sale_price NUMERIC(18,2) DEFAULT 0,
                        stock_quantity NUMERIC(18,2) DEFAULT 0,
                        reorder_level NUMERIC(18,2) DEFAULT 0,
                        tax_category_id UUID REFERENCES tax_categories(id),
                        is_active BOOLEAN DEFAULT true
                    )`
            },
            // Journal Entries
            {
                name: 'journal_entries',
                sql: `
                    CREATE TABLE IF NOT EXISTS journal_entries (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        deleted_at TIMESTAMP NULL,
                        company_id UUID NOT NULL REFERENCES companies(id),
                        entry_number VARCHAR NOT NULL,
                        entry_date DATE NOT NULL,
                        description TEXT,
                        reference VARCHAR,
                        status VARCHAR DEFAULT 'draft',
                        fiscal_year_id UUID REFERENCES fiscal_years(id),
                        posted_at TIMESTAMP,
                        posted_by UUID REFERENCES users(id)
                    )`
            },
            // Journal Entry Lines
            {
                name: 'journal_entry_lines',
                sql: `
                    CREATE TABLE IF NOT EXISTS journal_entry_lines (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        deleted_at TIMESTAMP NULL,
                        journal_entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
                        account_id UUID NOT NULL REFERENCES accounts(id),
                        debit NUMERIC(18,2) DEFAULT 0,
                        credit NUMERIC(18,2) DEFAULT 0,
                        description TEXT,
                        cost_center_id UUID REFERENCES cost_centers(id),
                        project_id UUID REFERENCES projects(id)
                    )`
            },
            // Invoices
            {
                name: 'invoices',
                sql: `
                    CREATE TABLE IF NOT EXISTS invoices (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        deleted_at TIMESTAMP NULL,
                        company_id UUID NOT NULL REFERENCES companies(id),
                        invoice_number VARCHAR NOT NULL,
                        invoice_date DATE NOT NULL,
                        due_date DATE,
                        type VARCHAR NOT NULL,
                        customer_id UUID REFERENCES customers(id),
                        supplier_id UUID REFERENCES suppliers(id),
                        subtotal NUMERIC(18,2) DEFAULT 0,
                        tax_amount NUMERIC(18,2) DEFAULT 0,
                        total_amount NUMERIC(18,2) DEFAULT 0,
                        status VARCHAR DEFAULT 'draft',
                        notes TEXT,
                        payment_terms INTEGER
                    )`
            },
            // Invoice Lines
            {
                name: 'invoice_lines',
                sql: `
                    CREATE TABLE IF NOT EXISTS invoice_lines (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        deleted_at TIMESTAMP NULL,
                        invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
                        item_id UUID REFERENCES items(id),
                        description TEXT,
                        quantity NUMERIC(18,2) DEFAULT 0,
                        unit_price NUMERIC(18,2) DEFAULT 0,
                        tax_category_id UUID REFERENCES tax_categories(id),
                        line_total NUMERIC(18,2) DEFAULT 0
                    )`
            },
            // Currencies
            {
                name: 'currencies',
                sql: `
                    CREATE TABLE IF NOT EXISTS currencies (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        deleted_at TIMESTAMP NULL,
                        code VARCHAR(3) UNIQUE NOT NULL,
                        name VARCHAR NOT NULL,
                        symbol VARCHAR(5) NOT NULL,
                        is_base BOOLEAN DEFAULT false,
                        is_active BOOLEAN DEFAULT true
                    )`
            },
            // Exchange Rates
            {
                name: 'exchange_rates',
                sql: `
                    CREATE TABLE IF NOT EXISTS exchange_rates (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        deleted_at TIMESTAMP NULL,
                        from_currency_id UUID NOT NULL REFERENCES currencies(id),
                        to_currency_id UUID NOT NULL REFERENCES currencies(id),
                        rate NUMERIC(18,6) NOT NULL,
                        effective_date DATE NOT NULL
                    )`
            },
            // Fixed Assets
            {
                name: 'fixed_assets',
                sql: `
                    CREATE TABLE IF NOT EXISTS fixed_assets (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        deleted_at TIMESTAMP NULL,
                        company_id UUID NOT NULL REFERENCES companies(id),
                        code VARCHAR NOT NULL,
                        name VARCHAR NOT NULL,
                        asset_type VARCHAR,
                        purchase_date DATE,
                        purchase_price NUMERIC(18,2) DEFAULT 0,
                        useful_life INTEGER,
                        salvage_value NUMERIC(18,2) DEFAULT 0,
                        depreciation_method VARCHAR,
                        book_value NUMERIC(18,2) DEFAULT 0
                    )`
            },
            // Budgets
            {
                name: 'budgets',
                sql: `
                    CREATE TABLE IF NOT EXISTS budgets (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        deleted_at TIMESTAMP NULL,
                        company_id UUID NOT NULL REFERENCES companies(id),
                        name VARCHAR NOT NULL,
                        fiscal_year_id UUID NOT NULL REFERENCES fiscal_years(id),
                        total_amount NUMERIC(18,2) DEFAULT 0,
                        status VARCHAR DEFAULT 'draft'
                    )`
            },
            // Reconciliations
            {
                name: 'reconciliations',
                sql: `
                    CREATE TABLE IF NOT EXISTS reconciliations (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        deleted_at TIMESTAMP NULL,
                        company_id UUID NOT NULL REFERENCES companies(id),
                        account_id UUID NOT NULL REFERENCES accounts(id),
                        statement_date DATE NOT NULL,
                        statement_balance NUMERIC(18,2) DEFAULT 0,
                        book_balance NUMERIC(18,2) DEFAULT 0,
                        difference NUMERIC(18,2) GENERATED ALWAYS AS (statement_balance - book_balance) STORED,
                        status VARCHAR DEFAULT 'pending'
                    )`
            }
        ];

        for (const table of tables) {
            await client.query(table.sql);
            console.log(`✅ Created table: ${table.name}`);
        }

        // Create indexes
        console.log('\n🔧 Creating indexes...');
        await client.query(`CREATE INDEX IF NOT EXISTS idx_accounts_company ON accounts(company_id)`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_accounts_parent ON accounts(parent_id)`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_accounts_level ON accounts(level)`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_journal_entries_company ON journal_entries(company_id)`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_invoices_company ON invoices(company_id)`);
        console.log('✅ Indexes created');

        // Insert default currencies
        console.log('\n🔧 Inserting default data...');
        await client.query(`
            INSERT INTO currencies (code, name, symbol, is_base, is_active)
            VALUES 
                ('USD', 'US Dollar', '$', true, true),
                ('EUR', 'Euro', '€', false, true),
                ('GBP', 'British Pound', '£', false, true),
                ('PKR', 'Pakistani Rupee', 'Rs', false, true)
            ON CONFLICT (code) DO NOTHING
        `);
        console.log('✅ Default currencies inserted');

        // Check total tables
        const result = await client.query(`
            SELECT COUNT(*) as count 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            AND table_name NOT IN ('migrations_history', 'typeorm_metadata')
        `);

        console.log(`\n✅ Total data tables created: ${result.rows[0].count}`);
        console.log('\n✅✅✅ ALL TABLES CREATED SUCCESSFULLY! ✅✅✅');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
    } finally {
        await client.end();
    }
}

createAllTables();
