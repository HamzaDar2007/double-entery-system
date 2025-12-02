import { DataSource } from 'typeorm';
import { Company } from '../../modules/companies/entities/company.entity';

export async function seedCompany(dataSource: DataSource): Promise<Company> {
    const companyRepo = dataSource.getRepository(Company);

    // Check if company already exists
    const existing = await companyRepo.findOne({
        where: { registrationNo: 'DEMO-001' },
    });

    if (existing) {
        console.log('  ℹ️  Demo company already exists, skipping...');
        return existing;
    }

    const company = companyRepo.create({
        name: 'Demo Company Ltd.',
        legalName: 'Demo Company Limited',
        registrationNo: 'DEMO-001',
        taxRegistrationNo: 'TAX-DEMO-001',
        countryCode: 'US',
        currencyCode: 'USD',
        fiscalYearStartMonth: 1, // January
        address: '123 Business Street, Suite 100, New York, NY 10001',
        phone: '+1-555-0100',
        email: 'info@democompany.com',
        isActive: true,
        settings: {
            dateFormat: 'MM/DD/YYYY',
            decimalPlaces: 2,
            taxEnabled: true,
        },
    });

    const saved = await companyRepo.save(company);
    console.log(`  ✅ Created demo company: ${saved.name} (ID: ${saved.id})`);

    return saved;
}
