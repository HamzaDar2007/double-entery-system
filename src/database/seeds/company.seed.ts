import { DataSource } from 'typeorm';
import { Company } from '../../modules/companies/entities/company.entity';

export async function seedCompany(dataSource: DataSource): Promise<Company> {
    const companyRepo = dataSource.getRepository(Company);

    // Check if company already exists using raw query
    const existing = await dataSource.query(
        `SELECT * FROM companies WHERE registration_no = $1 LIMIT 1`,
        ['DEMO-001'],
    );

    if (existing.length > 0) {
        console.log('  ℹ️  Demo company already exists, skipping...');
        return existing[0];
    }

    // Insert using raw query
    const result = await dataSource.query(
        `INSERT INTO companies (
      id, name, legal_name, registration_no, tax_registration_no, 
      country_code, currency_code, fiscal_year_start_month, 
      address, phone, email, is_active, settings, created_at
    ) VALUES (
      gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW()
    ) RETURNING *`,
        [
            'Demo Company Ltd.',
            'Demo Company Limited',
            'DEMO-001',
            'TAX-DEMO-001',
            'US',
            'USD',
            1,
            '123 Business Street, Suite 100, New York, NY 10001',
            '+1-555-0100',
            'info@democompany.com',
            true,
            JSON.stringify({
                dateFormat: 'MM/DD/YYYY',
                decimalPlaces: 2,
                taxEnabled: true,
            }),
        ],
    );

    const saved = result[0];
    console.log(`  ✅ Created demo company: ${saved.name} (ID: ${saved.id})`);

    return saved;
}
