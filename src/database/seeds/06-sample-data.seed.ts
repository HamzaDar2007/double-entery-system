import { DataSource } from 'typeorm';
import { Customer } from '../../modules/customers/entities/customer.entity';
import { Supplier } from '../../modules/suppliers/entities/supplier.entity';
import { Item } from '../../modules/items/entities/item.entity';

export async function seedSampleData(dataSource: DataSource) {
  // Get first company for seeding
  const companies = await dataSource.query('SELECT id FROM companies LIMIT 1');
  if (companies.length === 0) {
    console.log('No companies found. Skipping sample data seed.');
    return;
  }

  const companyId = companies[0].id;

  // Seed Customers
  const customerRepository = dataSource.getRepository(Customer);
  const customers = [
    {
      customerCode: 'CUST001',
      name: 'ABC Corporation',
      email: 'contact@abccorp.com',
      phone: '+1-555-0100',
      address: '123 Business St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      creditLimit: '50000.00',
      creditDays: 30,
      isActive: true,
      companyId,
    },
    {
      customerCode: 'CUST002',
      name: 'XYZ Industries',
      email: 'info@xyzind.com',
      phone: '+1-555-0200',
      address: '456 Commerce Ave',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      creditLimit: '75000.00',
      creditDays: 45,
      isActive: true,
      companyId,
    },
  ];

  for (const customerData of customers) {
    const existing = await customerRepository.findOne({
      where: { customerCode: customerData.customerCode, companyId },
    });

    if (!existing) {
      const customer = customerRepository.create(customerData);
      await customerRepository.save(customer);
      console.log(`Created customer: ${customerData.name}`);
    }
  }

  // Seed Suppliers
  const supplierRepository = dataSource.getRepository(Supplier);
  const suppliers = [
    {
      supplierCode: 'SUPP001',
      name: 'Global Supplies Inc',
      email: 'sales@globalsupplies.com',
      phone: '+1-555-0300',
      address: '789 Supply Chain Rd',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      paymentTermsDays: 30,
      isActive: true,
      companyId,
    },
    {
      supplierCode: 'SUPP002',
      name: 'Premium Materials Ltd',
      email: 'orders@premiummaterials.com',
      phone: '+1-555-0400',
      address: '321 Industrial Blvd',
      city: 'Houston',
      state: 'TX',
      country: 'USA',
      paymentTermsDays: 45,
      isActive: true,
      companyId,
    },
  ];

  for (const supplierData of suppliers) {
    const existing = await supplierRepository.findOne({
      where: { supplierCode: supplierData.supplierCode, companyId },
    });

    if (!existing) {
      const supplier = supplierRepository.create(supplierData);
      await supplierRepository.save(supplier);
      console.log(`Created supplier: ${supplierData.name}`);
    }
  }

  // Seed Items
  const itemRepository = dataSource.getRepository(Item);
  const items = [
    {
      itemCode: 'ITEM001',
      name: 'Office Desk',
      description: 'Standard office desk with drawers',
      unitOfMeasure: 'pcs',
      salesPrice: '299.99',
      purchasePrice: '199.99',
      isActive: true,
      isInventoryItem: true,
      currentStock: '50',
      reorderLevel: '10',
      category: 'Furniture',
      companyId,
    },
    {
      itemCode: 'ITEM002',
      name: 'Laptop Computer',
      description: 'Business laptop with 16GB RAM',
      unitOfMeasure: 'pcs',
      salesPrice: '1299.99',
      purchasePrice: '999.99',
      isActive: true,
      isInventoryItem: true,
      currentStock: '25',
      reorderLevel: '5',
      category: 'Electronics',
      companyId,
    },
    {
      itemCode: 'SRV001',
      name: 'Consulting Services',
      description: 'Professional consulting services per hour',
      unitOfMeasure: 'hour',
      salesPrice: '150.00',
      purchasePrice: '0.00',
      isActive: true,
      isInventoryItem: false,
      category: 'Services',
      companyId,
    },
  ];

  for (const itemData of items) {
    const existing = await itemRepository.findOne({
      where: { itemCode: itemData.itemCode, companyId },
    });

    if (!existing) {
      const item = itemRepository.create(itemData);
      await itemRepository.save(item);
      console.log(`Created item: ${itemData.name}`);
    }
  }

  console.log('Sample data seeding completed');
}
