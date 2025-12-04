import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
let authToken = '';
let fiscalYearId = '';
const accountIds: Record<string, string> = {};
const customerIds: string[] = [];
const supplierIds: string[] = [];
const itemIds: string[] = [];
const taxCategoryIds: string[] = [];
const voucherTypeIds: Record<string, string> = {};
const journalEntryIds: string[] = [];
const invoiceIds: string[] = [];

interface TestResult {
    name: string;
    status: 'PASS' | 'FAIL';
    message?: string;
}

const results: {
    passed: number;
    failed: number;
    tests: TestResult[];
} = {
    passed: 0,
    failed: 0,
    tests: [],
};

function logTest(name: string, status: 'PASS' | 'FAIL', message?: string) {
    const symbol = status === 'PASS' ? '✅' : '❌';
    console.log(`${symbol} ${name}${message ? ': ' + message : ''}`);

    results.tests.push({ name, status, message });
    if (status === 'PASS') results.passed++;
    else results.failed++;
}

async function testEndpoint(name: string, testFn: () => Promise<void>) {
    try {
        await testFn();
        logTest(name, 'PASS');
        return true;
    } catch (error: any) {
        logTest(name, 'FAIL', error.response?.data?.message || error.message);
        return false;
    }
}

async function runAllTests() {
    console.log('\n🧪 Starting API Endpoint Tests...\n');

    // Test Authentication
    console.log('\n📝 Authentication Tests:');
    await testEndpoint('Login User', async () => {
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'test@example.com',
            password: 'Test123!@#',
        }).catch(async () => {
            await axios.post(`${BASE_URL}/auth/register`, {
                email: 'test@example.com',
                password: 'Test123!@#',
                firstName: 'Test',
                lastName: 'User',
            });

            return await axios.post(`${BASE_URL}/auth/login`, {
                email: 'test@example.com',
                password: 'Test123!@#',
            });
        });

        if (!loginResponse.data.access_token) throw new Error('No token');
        authToken = loginResponse.data.access_token;
    });

    await testEndpoint('Get Profile', async () => {
        const response = await axios.get(`${BASE_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!response.data.email) throw new Error('No email');
    });

    // Test Companies
    console.log('\n🏢 Companies Tests:');
    await testEndpoint('Get Companies', async () => {
        const response = await axios.get(`${BASE_URL}/companies`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!Array.isArray(response.data)) throw new Error('Not an array');
    });

    // Test Fiscal Years
    console.log('\n📅 Fiscal Years Tests:');
    await testEndpoint('Get Fiscal Years', async () => {
        const response = await axios.get(`${BASE_URL}/fiscal-years`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        if (response.data.length > 0) {
            fiscalYearId = response.data[0].id;
        }
    });

    // Test Accounts
    console.log('\n📊 Accounts Tests:');
    await testEndpoint('Get Accounts', async () => {
        const response = await axios.get(`${BASE_URL}/accounts`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!Array.isArray(response.data)) throw new Error('Not an array');

        const accounts = response.data;
        accountIds.cash = accounts.find((a: any) => a.code === '1110-01')?.id || '';
        accountIds.sales = accounts.find((a: any) => a.code === '4110-01')?.id || '';
    });

    // Test Voucher Types
    console.log('\n📝 Voucher Types Tests:');
    await testEndpoint('Get Voucher Types', async () => {
        const response = await axios.get(`${BASE_URL}/voucher-types`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!Array.isArray(response.data)) throw new Error('Not an array');

        const types = response.data;
        voucherTypeIds.rv = types.find((t: any) => t.code === 'RV')?.id || '';
    });

    // Test Journal Entries
    if (accountIds.cash && accountIds.sales && voucherTypeIds.rv && fiscalYearId) {
        console.log('\n📝 Journal Entry Tests:');
        await testEndpoint('Create Journal Entry', async () => {
            const response = await axios.post(
                `${BASE_URL}/journal-entries`,
                {
                    voucherTypeId: voucherTypeIds.rv,
                    fiscalYearId: fiscalYearId,
                    entryDate: new Date().toISOString().split('T')[0],
                    description: 'Test entry',
                    lines: [
                        { accountId: accountIds.cash, debit: 100, credit: 0, description: 'Cash' },
                        { accountId: accountIds.sales, debit: 0, credit: 100, description: 'Sales' },
                    ],
                },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            if (!response.data.voucherNo) throw new Error('No voucher number');
            journalEntryIds.push(response.data.id);
        });
    }

    // Test Customers
    console.log('\n👥 Customers Tests:');
    await testEndpoint('Get Customers', async () => {
        const response = await axios.get(`${BASE_URL}/customers`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!Array.isArray(response.data)) throw new Error('Not an array');
    });

    // Test Suppliers
    console.log('\n🏭 Suppliers Tests:');
    await testEndpoint('Get Suppliers', async () => {
        const response = await axios.get(`${BASE_URL}/suppliers`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!Array.isArray(response.data)) throw new Error('Not an array');
    });

    // Test Items
    console.log('\n📦 Items Tests:');
    await testEndpoint('Get Items', async () => {
        const response = await axios.get(`${BASE_URL}/items`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!Array.isArray(response.data)) throw new Error('Not an array');
    });

    // Test Tax Categories
    console.log('\n💰 Tax Categories Tests:');
    await testEndpoint('Get Tax Categories', async () => {
        const response = await axios.get(`${BASE_URL}/tax-categories`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!Array.isArray(response.data)) throw new Error('Not an array');
    });

    // Print Summary
    console.log('\n' + '═'.repeat(60));
    console.log('\n📊 Test Summary:');
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📝 Total: ${results.tests.length}`);
    console.log(`📈 Success Rate: ${((results.passed / results.tests.length) * 100).toFixed(1)}%`);

    if (results.failed > 0) {
        console.log('\n❌ Failed Tests:');
        results.tests
            .filter((t) => t.status === 'FAIL')
            .forEach((t) => console.log(`  - ${t.name}: ${t.message}`));
    }

    console.log('\n' + '═'.repeat(60));
    console.log('\n✨ Test execution completed!\n');

    process.exit(results.failed > 0 ? 1 : 0);
}

runAllTests().catch((error) => {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
});
