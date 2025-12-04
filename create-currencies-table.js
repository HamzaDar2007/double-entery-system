const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'lab-accounts',
    user: 'postgres',
    password: 'postgres',
});

async function createCurrenciesTable() {
    try {
        await client.connect();
        console.log('Connected to database');

        // Create currencies table
        await client.query(`
            CREATE TABLE IF NOT EXISTS "currencies" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "code" character varying(3) NOT NULL UNIQUE,
                "name" character varying NOT NULL,
                "symbol" character varying(5) NOT NULL,
                "is_base" boolean NOT NULL DEFAULT false,
                "is_active" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_currencies" PRIMARY KEY ("id")
            )
        `);
        console.log('✅ Created currencies table');

        // Create exchange_rates table
        await client.query(`
            CREATE TABLE IF NOT EXISTS "exchange_rates" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "from_currency_id" uuid NOT NULL,
                "to_currency_id" uuid NOT NULL,
                "rate" numeric(18,6) NOT NULL,
                "effective_date" date NOT NULL,
                CONSTRAINT "PK_exchange_rates" PRIMARY KEY ("id"),
                CONSTRAINT "FK_exchange_rates_from" FOREIGN KEY ("from_currency_id") REFERENCES "currencies"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_exchange_rates_to" FOREIGN KEY ("to_currency_id") REFERENCES "currencies"("id") ON DELETE CASCADE
            )
        `);
        console.log('✅ Created exchange_rates table');

        // Insert default currencies
        await client.query(`
            INSERT INTO "currencies" ("code", "name", "symbol", "is_base", "is_active")
            VALUES 
                ('USD', 'US Dollar', '$', true, true),
                ('EUR', 'Euro', '€', false, true),
                ('GBP', 'British Pound', '£', false, true),
                ('PKR', 'Pakistani Rupee', 'Rs', false, true)
            ON CONFLICT (code) DO NOTHING
        `);
        console.log('✅ Inserted default currencies');

        console.log('\n✅ All done!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
    }
}

createCurrenciesTable();
