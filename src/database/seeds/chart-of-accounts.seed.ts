import { DataSource } from 'typeorm';

interface AccountSeed {
    code: string;
    name: string;
    type: string;
    level: string;
    parentCode?: string;
    isPosting: boolean;
    description?: string;
}

export async function seedChartOfAccounts(
    dataSource: DataSource,
    companyId: string,
): Promise<void> {
    // Standard Chart of Accounts (US GAAP style)
    const accounts: AccountSeed[] = [
        // ASSETS (1000-1999)
        { code: '1000', name: 'Assets', type: 'asset', level: '1', isPosting: false },
        { code: '1100', name: 'Current Assets', type: 'asset', level: '2', parentCode: '1000', isPosting: false },
        { code: '1110', name: 'Cash & Cash Equivalents', type: 'asset', level: '3', parentCode: '1100', isPosting: false },
        { code: '1110-01', name: 'Cash on Hand', type: 'asset', level: '4', parentCode: '1110', isPosting: true },
        { code: '1110-02', name: 'Petty Cash', type: 'asset', level: '4', parentCode: '1110', isPosting: true },
        { code: '1110-03', name: 'Bank - Checking Account', type: 'asset', level: '4', parentCode: '1110', isPosting: true },
        { code: '1110-04', name: 'Bank - Savings Account', type: 'asset', level: '4', parentCode: '1110', isPosting: true },
        { code: '1120', name: 'Accounts Receivable', type: 'asset', level: '3', parentCode: '1100', isPosting: false },
        { code: '1120-01', name: 'Trade Receivables', type: 'asset', level: '4', parentCode: '1120', isPosting: true },
        { code: '1120-02', name: 'Allowance for Doubtful Accounts', type: 'asset', level: '4', parentCode: '1120', isPosting: true },
        { code: '1130', name: 'Inventory', type: 'asset', level: '3', parentCode: '1100', isPosting: false },
        { code: '1130-01', name: 'Raw Materials', type: 'asset', level: '4', parentCode: '1130', isPosting: true },
        { code: '1130-02', name: 'Work in Progress', type: 'asset', level: '4', parentCode: '1130', isPosting: true },
        { code: '1130-03', name: 'Finished Goods', type: 'asset', level: '4', parentCode: '1130', isPosting: true },
        { code: '1200', name: 'Fixed Assets', type: 'asset', level: '2', parentCode: '1000', isPosting: false },
        { code: '1210', name: 'Property, Plant & Equipment', type: 'asset', level: '3', parentCode: '1200', isPosting: false },
        { code: '1210-01', name: 'Land', type: 'asset', level: '4', parentCode: '1210', isPosting: true },
        { code: '1210-02', name: 'Buildings', type: 'asset', level: '4', parentCode: '1210', isPosting: true },
        { code: '1210-03', name: 'Machinery & Equipment', type: 'asset', level: '4', parentCode: '1210', isPosting: true },
        { code: '1210-04', name: 'Furniture & Fixtures', type: 'asset', level: '4', parentCode: '1210', isPosting: true },
        { code: '1210-05', name: 'Vehicles', type: 'asset', level: '4', parentCode: '1210', isPosting: true },
        { code: '1210-06', name: 'Accumulated Depreciation', type: 'asset', level: '4', parentCode: '1210', isPosting: true },

        // LIABILITIES (2000-2999)
        { code: '2000', name: 'Liabilities', type: 'liability', level: '1', isPosting: false },
        { code: '2100', name: 'Current Liabilities', type: 'liability', level: '2', parentCode: '2000', isPosting: false },
        { code: '2110', name: 'Accounts Payable', type: 'liability', level: '3', parentCode: '2100', isPosting: false },
        { code: '2110-01', name: 'Trade Payables', type: 'liability', level: '4', parentCode: '2110', isPosting: true },
        { code: '2110-02', name: 'Accrued Expenses', type: 'liability', level: '4', parentCode: '2110', isPosting: true },
        { code: '2120', name: 'Tax Liabilities', type: 'liability', level: '3', parentCode: '2100', isPosting: false },
        { code: '2120-01', name: 'Sales Tax Payable', type: 'liability', level: '4', parentCode: '2120', isPosting: true },
        { code: '2120-02', name: 'Income Tax Payable', type: 'liability', level: '4', parentCode: '2120', isPosting: true },
        { code: '2120-03', name: 'Payroll Tax Payable', type: 'liability', level: '4', parentCode: '2120', isPosting: true },
        { code: '2200', name: 'Long-term Liabilities', type: 'liability', level: '2', parentCode: '2000', isPosting: false },
        { code: '2210', name: 'Long-term Debt', type: 'liability', level: '3', parentCode: '2200', isPosting: false },
        { code: '2210-01', name: 'Bank Loans', type: 'liability', level: '4', parentCode: '2210', isPosting: true },
        { code: '2210-02', name: 'Mortgage Payable', type: 'liability', level: '4', parentCode: '2210', isPosting: true },

        // EQUITY (3000-3999)
        { code: '3000', name: 'Equity', type: 'equity', level: '1', isPosting: false },
        { code: '3100', name: "Owner's Equity", type: 'equity', level: '2', parentCode: '3000', isPosting: false },
        { code: '3110', name: 'Capital', type: 'equity', level: '3', parentCode: '3100', isPosting: false },
        { code: '3110-01', name: "Owner's Capital", type: 'equity', level: '4', parentCode: '3110', isPosting: true },
        { code: '3110-02', name: 'Retained Earnings', type: 'equity', level: '4', parentCode: '3110', isPosting: true },
        { code: '3110-03', name: 'Drawings', type: 'equity', level: '4', parentCode: '3110', isPosting: true },

        // INCOME (4000-4999)
        { code: '4000', name: 'Revenue', type: 'income', level: '1', isPosting: false },
        { code: '4100', name: 'Operating Revenue', type: 'income', level: '2', parentCode: '4000', isPosting: false },
        { code: '4110', name: 'Sales Revenue', type: 'income', level: '3', parentCode: '4100', isPosting: false },
        { code: '4110-01', name: 'Product Sales', type: 'income', level: '4', parentCode: '4110', isPosting: true },
        { code: '4110-02', name: 'Service Revenue', type: 'income', level: '4', parentCode: '4110', isPosting: true },
        { code: '4110-03', name: 'Sales Returns & Allowances', type: 'income', level: '4', parentCode: '4110', isPosting: true },
        { code: '4200', name: 'Other Income', type: 'income', level: '2', parentCode: '4000', isPosting: false },
        { code: '4210', name: 'Non-operating Income', type: 'income', level: '3', parentCode: '4200', isPosting: false },
        { code: '4210-01', name: 'Interest Income', type: 'income', level: '4', parentCode: '4210', isPosting: true },
        { code: '4210-02', name: 'Dividend Income', type: 'income', level: '4', parentCode: '4210', isPosting: true },

        // EXPENSES (5000-5999)
        { code: '5000', name: 'Expenses', type: 'expense', level: '1', isPosting: false },
        { code: '5100', name: 'Cost of Goods Sold', type: 'expense', level: '2', parentCode: '5000', isPosting: false },
        { code: '5110', name: 'Direct Costs', type: 'expense', level: '3', parentCode: '5100', isPosting: false },
        { code: '5110-01', name: 'Cost of Materials', type: 'expense', level: '4', parentCode: '5110', isPosting: true },
        { code: '5110-02', name: 'Direct Labor', type: 'expense', level: '4', parentCode: '5110', isPosting: true },
        { code: '5110-03', name: 'Manufacturing Overhead', type: 'expense', level: '4', parentCode: '5110', isPosting: true },
        { code: '5200', name: 'Operating Expenses', type: 'expense', level: '2', parentCode: '5000', isPosting: false },
        { code: '5210', name: 'Selling Expenses', type: 'expense', level: '3', parentCode: '5200', isPosting: false },
        { code: '5210-01', name: 'Advertising & Marketing', type: 'expense', level: '4', parentCode: '5210', isPosting: true },
        { code: '5210-02', name: 'Sales Commissions', type: 'expense', level: '4', parentCode: '5210', isPosting: true },
        { code: '5220', name: 'Administrative Expenses', type: 'expense', level: '3', parentCode: '5200', isPosting: false },
        { code: '5220-01', name: 'Salaries & Wages', type: 'expense', level: '4', parentCode: '5220', isPosting: true },
        { code: '5220-02', name: 'Rent Expense', type: 'expense', level: '4', parentCode: '5220', isPosting: true },
        { code: '5220-03', name: 'Utilities Expense', type: 'expense', level: '4', parentCode: '5220', isPosting: true },
        { code: '5220-04', name: 'Office Supplies', type: 'expense', level: '4', parentCode: '5220', isPosting: true },
        { code: '5220-05', name: 'Insurance Expense', type: 'expense', level: '4', parentCode: '5220', isPosting: true },
        { code: '5220-06', name: 'Depreciation Expense', type: 'expense', level: '4', parentCode: '5220', isPosting: true },
        { code: '5220-07', name: 'Professional Fees', type: 'expense', level: '4', parentCode: '5220', isPosting: true },
        { code: '5230', name: 'Financial Expenses', type: 'expense', level: '3', parentCode: '5200', isPosting: false },
        { code: '5230-01', name: 'Interest Expense', type: 'expense', level: '4', parentCode: '5230', isPosting: true },
        { code: '5230-02', name: 'Bank Charges', type: 'expense', level: '4', parentCode: '5230', isPosting: true },
    ];

    // Create accounts in order (parents first)
    const accountMap = new Map<string, string>(); // code -> id mapping
    let created = 0;
    let skipped = 0;

    for (const accountSeed of accounts) {
        // Check if exists
        const existing = await dataSource.query(
            `SELECT id FROM accounts WHERE company_id = $1 AND code = $2 LIMIT 1`,
            [companyId, accountSeed.code],
        );

        if (existing.length > 0) {
            accountMap.set(accountSeed.code, existing[0].id);
            skipped++;
            continue;
        }

        // Get parent ID if parentCode is specified
        const parentId = accountSeed.parentCode
            ? accountMap.get(accountSeed.parentCode)
            : null;

        // Insert account
        const result = await dataSource.query(
            `INSERT INTO accounts (
        id, company_id, code, name, type, level, parent_id, 
        is_posting, is_active, is_system, created_at
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()
      ) RETURNING id`,
            [
                companyId,
                accountSeed.code,
                accountSeed.name,
                accountSeed.type,
                accountSeed.level,
                parentId,
                accountSeed.isPosting,
                true, // is_active
                true, // is_system
            ],
        );

        accountMap.set(accountSeed.code, result[0].id);
        created++;
    }

    console.log(`  ✅ Created ${created} accounts, skipped ${skipped} existing`);
}
