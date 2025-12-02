import { DataSource } from 'typeorm';
import { Account } from '../../modules/accounts/entities/account.entity';
import { AccountType } from '../../common/enums/account-type.enum';
import { AccountLevel } from 'src/common/enums/account-level.enum';

interface AccountSeed {
    code: string;
    name: string;
    type: AccountType;
    level: AccountLevel;
    parentCode?: string;
    isPosting: boolean;
    description?: string;
}

export async function seedChartOfAccounts(
    dataSource: DataSource,
    companyId: string,
): Promise<void> {
    const accountRepo = dataSource.getRepository(Account);

    // Standard Chart of Accounts (US GAAP style)
    const accounts: AccountSeed[] = [
        // ASSETS (1000-1999)
        // Level 1
        { code: '1000', name: 'Assets', type: AccountType.ASSET, level: AccountLevel.LEVEL_1, isPosting: false },

        // Level 2 - Current Assets
        { code: '1100', name: 'Current Assets', type: AccountType.ASSET, level: AccountLevel.LEVEL_2, parentCode: '1000', isPosting: false },

        // Level 3 - Cash & Bank
        { code: '1110', name: 'Cash & Cash Equivalents', type: AccountType.ASSET, level: AccountLevel.LEVEL_3, parentCode: '1100', isPosting: false },
        { code: '1110-01', name: 'Cash on Hand', type: AccountType.ASSET, level: AccountLevel.LEVEL_4, parentCode: '1110', isPosting: true },
        { code: '1110-02', name: 'Petty Cash', type: AccountType.ASSET, level: AccountLevel.LEVEL_4, parentCode: '1110', isPosting: true },
        { code: '1110-03', name: 'Bank - Checking Account', type: AccountType.ASSET, level: AccountLevel.LEVEL_4, parentCode: '1110', isPosting: true },
        { code: '1110-04', name: 'Bank - Savings Account', type: AccountType.ASSET, level: AccountLevel.LEVEL_4, parentCode: '1110', isPosting: true },

        // Level 3 - Accounts Receivable
        { code: '1120', name: 'Accounts Receivable', type: AccountType.ASSET, level: AccountLevel.LEVEL_3, parentCode: '1100', isPosting: false },
        { code: '1120-01', name: 'Trade Receivables', type: AccountType.ASSET, level: AccountLevel.LEVEL_4, parentCode: '1120', isPosting: true },
        { code: '1120-02', name: 'Allowance for Doubtful Accounts', type: AccountType.ASSET, level: AccountLevel.LEVEL_4, parentCode: '1120', isPosting: true },

        // Level 3 - Inventory
        { code: '1130', name: 'Inventory', type: AccountType.ASSET, level: AccountLevel.LEVEL_3, parentCode: '1100', isPosting: false },
        { code: '1130-01', name: 'Raw Materials', type: AccountType.ASSET, level: AccountLevel.LEVEL_4, parentCode: '1130', isPosting: true },
        { code: '1130-02', name: 'Work in Progress', type: AccountType.ASSET, level: AccountLevel.LEVEL_4, parentCode: '1130', isPosting: true },
        { code: '1130-03', name: 'Finished Goods', type: AccountType.ASSET, level: AccountLevel.LEVEL_4, parentCode: '1130', isPosting: true },

        // Level 2 - Fixed Assets
        { code: '1200', name: 'Fixed Assets', type: AccountType.ASSET, level: AccountLevel.LEVEL_2, parentCode: '1000', isPosting: false },
        { code: '1210', name: 'Property, Plant & Equipment', type: AccountType.ASSET, level: AccountLevel.LEVEL_3, parentCode: '1200', isPosting: false },
        { code: '1210-01', name: 'Land', type: AccountType.ASSET, level: AccountLevel.LEVEL_4, parentCode: '1210', isPosting: true },
        { code: '1210-02', name: 'Buildings', type: AccountType.ASSET, level: AccountLevel.LEVEL_4, parentCode: '1210', isPosting: true },
        { code: '1210-03', name: 'Machinery & Equipment', type: AccountType.ASSET, level: AccountLevel.LEVEL_4, parentCode: '1210', isPosting: true },
        { code: '1210-04', name: 'Furniture & Fixtures', type: AccountType.ASSET, level: AccountLevel.LEVEL_4, parentCode: '1210', isPosting: true },
        { code: '1210-05', name: 'Vehicles', type: AccountType.ASSET, level: AccountLevel.LEVEL_4, parentCode: '1210', isPosting: true },
        { code: '1210-06', name: 'Accumulated Depreciation', type: AccountType.ASSET, level: AccountLevel.LEVEL_4, parentCode: '1210', isPosting: true },

        // LIABILITIES (2000-2999)
        // Level 1
        { code: '2000', name: 'Liabilities', type: AccountType.LIABILITY, level: AccountLevel.LEVEL_1, isPosting: false },

        // Level 2 - Current Liabilities
        { code: '2100', name: 'Current Liabilities', type: AccountType.LIABILITY, level: AccountLevel.LEVEL_2, parentCode: '2000', isPosting: false },
        { code: '2110', name: 'Accounts Payable', type: AccountType.LIABILITY, level: AccountLevel.LEVEL_3, parentCode: '2100', isPosting: false },
        { code: '2110-01', name: 'Trade Payables', type: AccountType.LIABILITY, level: AccountLevel.LEVEL_4, parentCode: '2110', isPosting: true },
        { code: '2110-02', name: 'Accrued Expenses', type: AccountType.LIABILITY, level: AccountLevel.LEVEL_4, parentCode: '2110', isPosting: true },

        { code: '2120', name: 'Tax Liabilities', type: AccountType.LIABILITY, level: AccountLevel.LEVEL_3, parentCode: '2100', isPosting: false },
        { code: '2120-01', name: 'Sales Tax Payable', type: AccountType.LIABILITY, level: AccountLevel.LEVEL_4, parentCode: '2120', isPosting: true },
        { code: '2120-02', name: 'Income Tax Payable', type: AccountType.LIABILITY, level: AccountLevel.LEVEL_4, parentCode: '2120', isPosting: true },
        { code: '2120-03', name: 'Payroll Tax Payable', type: AccountType.LIABILITY, level: AccountLevel.LEVEL_4, parentCode: '2120', isPosting: true },

        // Level 2 - Long-term Liabilities
        { code: '2200', name: 'Long-term Liabilities', type: AccountType.LIABILITY, level: AccountLevel.LEVEL_2, parentCode: '2000', isPosting: false },
        { code: '2210', name: 'Long-term Debt', type: AccountType.LIABILITY, level: AccountLevel.LEVEL_3, parentCode: '2200', isPosting: false },
        { code: '2210-01', name: 'Bank Loans', type: AccountType.LIABILITY, level: AccountLevel.LEVEL_4, parentCode: '2210', isPosting: true },
        { code: '2210-02', name: 'Mortgage Payable', type: AccountType.LIABILITY, level: AccountLevel.LEVEL_4, parentCode: '2210', isPosting: true },

        // EQUITY (3000-3999)
        // Level 1
        { code: '3000', name: 'Equity', type: AccountType.EQUITY, level: AccountLevel.LEVEL_1, isPosting: false },
        { code: '3100', name: 'Owner\'s Equity', type: AccountType.EQUITY, level: AccountLevel.LEVEL_2, parentCode: '3000', isPosting: false },
        { code: '3110', name: 'Capital', type: AccountType.EQUITY, level: AccountLevel.LEVEL_3, parentCode: '3100', isPosting: false },
        { code: '3110-01', name: 'Owner\'s Capital', type: AccountType.EQUITY, level: AccountLevel.LEVEL_4, parentCode: '3110', isPosting: true },
        { code: '3110-02', name: 'Retained Earnings', type: AccountType.EQUITY, level: AccountLevel.LEVEL_4, parentCode: '3110', isPosting: true },
        { code: '3110-03', name: 'Drawings', type: AccountType.EQUITY, level: AccountLevel.LEVEL_4, parentCode: '3110', isPosting: true },

        // REVENUE (4000-4999)
        // Level 1
        { code: '4000', name: 'Revenue', type: AccountType.INCOME, level: AccountLevel.LEVEL_1, isPosting: false },
        { code: '4100', name: 'Operating Revenue', type: AccountType.INCOME, level: AccountLevel.LEVEL_2, parentCode: '4000', isPosting: false },
        { code: '4110', name: 'Sales Revenue', type: AccountType.INCOME, level: AccountLevel.LEVEL_3, parentCode: '4100', isPosting: false },
        { code: '4110-01', name: 'Product Sales', type: AccountType.INCOME, level: AccountLevel.LEVEL_4, parentCode: '4110', isPosting: true },
        { code: '4110-02', name: 'Service Revenue', type: AccountType.INCOME, level: AccountLevel.LEVEL_4, parentCode: '4110', isPosting: true },
        { code: '4110-03', name: 'Sales Returns & Allowances', type: AccountType.INCOME, level: AccountLevel.LEVEL_4, parentCode: '4110', isPosting: true },

        { code: '4200', name: 'Other Income', type: AccountType.INCOME, level: AccountLevel.LEVEL_2, parentCode: '4000', isPosting: false },
        { code: '4210', name: 'Non-operating Income', type: AccountType.INCOME, level: AccountLevel.LEVEL_3, parentCode: '4200', isPosting: false },
        { code: '4210-01', name: 'Interest Income', type: AccountType.INCOME, level: AccountLevel.LEVEL_4, parentCode: '4210', isPosting: true },
        { code: '4210-02', name: 'Dividend Income', type: AccountType.INCOME, level: AccountLevel.LEVEL_4, parentCode: '4210', isPosting: true },

        // EXPENSES (5000-5999)
        // Level 1
        { code: '5000', name: 'Expenses', type: AccountType.EXPENSE, level: AccountLevel.LEVEL_1, isPosting: false },

        // Cost of Goods Sold
        { code: '5100', name: 'Cost of Goods Sold', type: AccountType.EXPENSE, level: AccountLevel.LEVEL_2, parentCode: '5000', isPosting: false },
        { code: '5110', name: 'Direct Costs', type: AccountType.EXPENSE, level: AccountLevel.LEVEL_3, parentCode: '5100', isPosting: false },
        { code: '5110-01', name: 'Cost of Materials', type: AccountType.EXPENSE, level: AccountLevel.LEVEL_4, parentCode: '5110', isPosting: true },
        { code: '5110-02', name: 'Direct Labor', type: AccountType.EXPENSE, level: AccountLevel.LEVEL_4, parentCode: '5110', isPosting: true },
        { code: '5110-03', name: 'Manufacturing Overhead', type: AccountType.EXPENSE, level: AccountLevel.LEVEL_4, parentCode: '5110', isPosting: true },

        // Operating Expenses
        { code: '5200', name: 'Operating Expenses', type: AccountType.EXPENSE, level: AccountLevel.LEVEL_2, parentCode: '5000', isPosting: false },

        { code: '5210', name: 'Selling Expenses', type: AccountType.EXPENSE, level: AccountLevel.LEVEL_3, parentCode: '5200', isPosting: false },
        { code: '5210-01', name: 'Advertising & Marketing', type: AccountType.EXPENSE, level: AccountLevel.LEVEL_4, parentCode: '5210', isPosting: true },
        { code: '5210-02', name: 'Sales Commissions', type: AccountType.EXPENSE, level: AccountLevel.LEVEL_4, parentCode: '5210', isPosting: true },

        { code: '5220', name: 'Administrative Expenses', type: AccountType.EXPENSE, level: AccountLevel.LEVEL_3, parentCode: '5200', isPosting: false },
        { code: '5220-01', name: 'Salaries & Wages', type: AccountType.EXPENSE, level: AccountLevel.LEVEL_4, parentCode: '5220', isPosting: true },
        { code: '5220-02', name: 'Rent Expense', type: AccountType.EXPENSE, level: AccountLevel.LEVEL_4, parentCode: '5220', isPosting: true },
        { code: '5220-03', name: 'Utilities Expense', type: AccountType.EXPENSE, level: AccountLevel.LEVEL_4, parentCode: '5220', isPosting: true },
        { code: '5220-04', name: 'Office Supplies', type: AccountType.EXPENSE, level: AccountLevel.LEVEL_4, parentCode: '5220', isPosting: true },
        { code: '5220-05', name: 'Insurance Expense', type: AccountType.EXPENSE, level: AccountLevel.LEVEL_4, parentCode: '5220', isPosting: true },
        { code: '5220-06', name: 'Depreciation Expense', type: AccountType.EXPENSE, level: AccountLevel.LEVEL_4, parentCode: '5220', isPosting: true },
        { code: '5220-07', name: 'Professional Fees', type: AccountType.EXPENSE, level: AccountLevel.LEVEL_4, parentCode: '5220', isPosting: true },

        { code: '5230', name: 'Financial Expenses', type: AccountType.EXPENSE, level: AccountLevel.LEVEL_3, parentCode: '5200', isPosting: false },
        { code: '5230-01', name: 'Interest Expense', type: AccountType.EXPENSE, level: AccountLevel.LEVEL_4, parentCode: '5230', isPosting: true },
        { code: '5230-02', name: 'Bank Charges', type: AccountType.EXPENSE, level: AccountLevel.LEVEL_4, parentCode: '5230', isPosting: true },
    ];

    // Create accounts in order (parents first)
    const accountMap = new Map<string, string>(); // code -> id mapping
    let created = 0;
    let skipped = 0;

    for (const accountSeed of accounts) {
        const existing = await accountRepo.findOne({
            where: { companyId, code: accountSeed.code },
        });

        if (existing) {
            accountMap.set(accountSeed.code, existing.id);
            skipped++;
            continue;
        }

        const account = accountRepo.create({
            companyId,
            code: accountSeed.code,
            name: accountSeed.name,
            type: accountSeed.type,
            level: accountSeed.level,
            isPosting: accountSeed.isPosting,
            description: accountSeed.description,
            parentId: accountSeed.parentCode
                ? accountMap.get(accountSeed.parentCode)
                : undefined,
            isActive: true,
            isSystem: true, // Mark as system account
        });

        const saved = await accountRepo.save(account);
        accountMap.set(accountSeed.code, saved.id);
        created++;
    }

    console.log(`  ✅ Created ${created} accounts, skipped ${skipped} existing`);
}
