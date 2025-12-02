import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { dataSourceOptions } from '../../../typeorm.config';
import { seedCompany } from './company.seed';
import { seedVoucherTypes } from './voucher-types.seed';
import { seedChartOfAccounts } from './chart-of-accounts.seed';

config();

async function runSeeds() {
    const dataSource = new DataSource(dataSourceOptions);

    try {
        console.log('🌱 Starting database seeding...');

        await dataSource.initialize();
        console.log('✅ Database connection established');

        // Seed in order due to dependencies
        console.log('\n📦 Seeding company...');
        const company = await seedCompany(dataSource);

        console.log('\n📦 Seeding voucher types...');
        await seedVoucherTypes(dataSource, company.id);

        console.log('\n📦 Seeding chart of accounts...');
        await seedChartOfAccounts(dataSource, company.id);

        console.log('\n✅ All seeds completed successfully!');

    } catch (error) {
        console.error('❌ Error during seeding:', error);
        process.exit(1);
    } finally {
        await dataSource.destroy();
    }
}

runSeeds();
