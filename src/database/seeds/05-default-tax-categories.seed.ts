import { DataSource } from 'typeorm';
import { TaxCategory, TaxType } from '../../modules/tax-categories/entities/tax-category.entity';

export async function seedTaxCategories(dataSource: DataSource) {
  const taxCategoryRepository = dataSource.getRepository(TaxCategory);

  // Get first company for seeding
  const companies = await dataSource.query('SELECT id FROM companies LIMIT 1');
  if (companies.length === 0) {
    console.log('No companies found. Skipping tax categories seed.');
    return;
  }

  const companyId = companies[0].id;

  const taxCategories = [
    {
      code: 'VAT-STD',
      name: 'Standard VAT',
      description: 'Standard Value Added Tax',
      type: TaxType.VAT,
      rate: '15.00',
      isActive: true,
      isCompound: false,
      companyId,
    },
    {
      code: 'VAT-RED',
      name: 'Reduced VAT',
      description: 'Reduced Value Added Tax',
      type: TaxType.VAT,
      rate: '5.00',
      isActive: true,
      isCompound: false,
      companyId,
    },
    {
      code: 'ST-STD',
      name: 'Standard Sales Tax',
      description: 'Standard Sales Tax',
      type: TaxType.SALES_TAX,
      rate: '10.00',
      isActive: true,
      isCompound: false,
      companyId,
    },
    {
      code: 'WHT-INC',
      name: 'Withholding Tax - Income',
      description: 'Withholding Tax on Income',
      type: TaxType.WITHHOLDING_TAX,
      rate: '5.00',
      isActive: true,
      isCompound: false,
      companyId,
    },
    {
      code: 'WHT-SRV',
      name: 'Withholding Tax - Services',
      description: 'Withholding Tax on Services',
      type: TaxType.WITHHOLDING_TAX,
      rate: '10.00',
      isActive: true,
      isCompound: false,
      companyId,
    },
    {
      code: 'IT-STD',
      name: 'Income Tax',
      description: 'Standard Income Tax',
      type: TaxType.INCOME_TAX,
      rate: '20.00',
      isActive: true,
      isCompound: false,
      companyId,
    },
  ];

  for (const taxCategoryData of taxCategories) {
    const existing = await taxCategoryRepository.findOne({
      where: { code: taxCategoryData.code, companyId },
    });

    if (!existing) {
      const taxCategory = taxCategoryRepository.create(taxCategoryData);
      await taxCategoryRepository.save(taxCategory);
      console.log(`Created tax category: ${taxCategoryData.name}`);
    }
  }

  console.log('Tax categories seeding completed');
}
