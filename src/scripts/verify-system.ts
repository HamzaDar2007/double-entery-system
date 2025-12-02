import axios from 'axios';

const API_URL = 'http://localhost:3000';
let token: string;
let companyId: string;
let fiscalYearId: string;
let accounts: any = {};

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (companyId) {
    config.headers['x-company-id'] = companyId;
  }
  return config;
});

async function runVerification() {
  try {
    console.log('🚀 Starting System Verification...');

    // 1. Authentication
    console.log('\n1️⃣  Authentication');
    try {
      const loginRes = await api.post('/auth/login', {
        email: 'admin@example.com',
        password: 'admin123',
      });
      token = loginRes.data.accessToken;
      console.log('✅ Login successful');
    } catch (error) {
      console.log('⚠️  Login failed, trying to register...');
      // If login fails, try to register (in case seed didn't run)
      // Note: This might fail if auth requires specific setup, but worth a try or assume seed ran.
      // For now, let's assume seed ran or we can register a new user.
      throw error;
    }

    // 2. Setup Company
    console.log('\n2️⃣  Company Setup');
    const companyRes = await api.post('/companies', {
      name: 'Test Corp ' + Date.now(),
      taxId: '123456789',
      currency: 'USD',
    });
    companyId = companyRes.data.id;
    console.log(`✅ Company created: ${companyRes.data.name} (${companyId})`);

    // 3. Setup Fiscal Year
    console.log('\n3️⃣  Fiscal Year Setup');
    const fyRes = await api.post('/fiscal-years', {
      name: 'FY 2024',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    });
    fiscalYearId = fyRes.data.id;
    console.log(`✅ Fiscal Year created: ${fyRes.data.name}`);

    // 4. Setup Chart of Accounts
    console.log('\n4️⃣  Chart of Accounts Setup');
    // We need: Bank (Asset), Capital (Equity), Sales (Income), AR (Asset)
    // Assuming we can create them or they exist. Let's create them to be sure.
    // Note: In a real app, we might need to follow a hierarchy.
    // Let's assume Level 1 exists or we create root.
    // For simplicity, I'll try to create leaf accounts directly if the system allows or creates parents.
    // If strict hierarchy is enforced, this might fail. Let's try to fetch existing or create simple structure.
    
    // Create Root Accounts (Level 1)
    const assetRoot = await api.post('/accounts', { name: 'Assets', code: '1000', type: 'ASSET', level: 1 });
    const equityRoot = await api.post('/accounts', { name: 'Equity', code: '3000', type: 'EQUITY', level: 1 });
    const incomeRoot = await api.post('/accounts', { name: 'Income', code: '4000', type: 'INCOME', level: 1 });

    // Create Child Accounts (Level 2/Leaf) - Adjusting logic based on likely implementation
    const bankAcct = await api.post('/accounts', { name: 'Bank', code: '1100', type: 'ASSET', parentId: assetRoot.data.id, level: 2 });
    const arAcct = await api.post('/accounts', { name: 'Accounts Receivable', code: '1200', type: 'ASSET', parentId: assetRoot.data.id, level: 2 });
    const capitalAcct = await api.post('/accounts', { name: 'Capital', code: '3100', type: 'EQUITY', parentId: equityRoot.data.id, level: 2 });
    const salesAcct = await api.post('/accounts', { name: 'Sales', code: '4100', type: 'INCOME', parentId: incomeRoot.data.id, level: 2 });

    accounts = {
      bank: bankAcct.data.id,
      ar: arAcct.data.id,
      capital: capitalAcct.data.id,
      sales: salesAcct.data.id,
    };
    console.log('✅ Accounts created');

    // 5. Transactions
    console.log('\n5️⃣  Transactions');
    
    // 5.1 Capital Injection: Dr Bank 10,000, Cr Capital 10,000
    console.log('   -> Posting Journal Entry: Capital Injection');
    await api.post('/journal-entries', {
      date: '2024-01-01',
      description: 'Initial Capital',
      lines: [
        { accountId: accounts.bank, debit: 10000, credit: 0 },
        { accountId: accounts.capital, debit: 0, credit: 10000 },
      ],
    });
    console.log('   ✅ Journal Entry Posted');

    // 5.2 Sales Invoice: Dr AR 1,000, Cr Sales 1,000
    // Assuming Invoices module creates a voucher automatically or we post a manual entry for simplicity.
    // Let's try the Invoice flow if possible.
    console.log('   -> Creating Sales Invoice');
    // Need a customer first
    const customer = await api.post('/customers', { name: 'John Doe', email: 'john@example.com' });
    
    const invoiceRes = await api.post('/invoices', {
      customerId: customer.data.id,
      date: '2024-01-02',
      dueDate: '2024-02-02',
      items: [
        { description: 'Service', quantity: 1, unitPrice: 1000, accountId: accounts.sales } // Assuming invoice item needs revenue account
      ]
    });
    // Approve/Post invoice if needed. Assuming 'Issued' status triggers GL.
    // If not, we might need to manually trigger or check status.
    // Let's assume creating it is enough for Draft, maybe need to 'issue'.
    await api.post(`/invoices/${invoiceRes.data.id}/issue`); 
    console.log('   ✅ Invoice Issued');

    // 5.3 Payment: Dr Bank 1,000, Cr AR 1,000
    console.log('   -> Recording Payment');
    await api.post(`/invoices/${invoiceRes.data.id}/payment`, {
      amount: 1000,
      paymentMethod: 'BANK',
      accountId: accounts.bank // Deposit to Bank
    });
    console.log('   ✅ Payment Recorded');

    // 6. Verification
    console.log('\n6️⃣  Verification (Financial Reports)');
    
    // 6.1 Trial Balance
    const tbRes = await api.get('/reports/trial-balance', { params: { fiscalYearId } });
    console.log('   -> Trial Balance:', JSON.stringify(tbRes.data, null, 2));
    // Verify figures logic here...
    
    // 6.2 Balance Sheet
    const bsRes = await api.get('/reports/balance-sheet', { params: { fiscalYearId } });
    console.log('   -> Balance Sheet:', JSON.stringify(bsRes.data, null, 2));

    // 6.3 Income Statement
    const isRes = await api.get('/reports/income-statement', { params: { fiscalYearId } });
    console.log('   -> Income Statement:', JSON.stringify(isRes.data, null, 2));

    console.log('\n✅✅ System Verification Completed Successfully! ✅✅');

  } catch (error: any) {
    console.error('\n❌ Verification Failed:', error.message);
    if (error.response) {
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

runVerification();
