# Testing Guide - Double-Entry Accounting System

## Overview

This guide provides test scenarios and example test cases for the accounting system.

---

## Prerequisites

1. **Database Setup**
   ```bash
   # Run migrations
   npm run migration:run
   
   # Seed initial data
   npm run seed:run
   ```

2. **Start Server**
   ```bash
   npm run start:dev
   ```

3. **Test Tool**
   - Postman, Insomnia, or curl
   - Base URL: `http://localhost:3000`

---

## Test Flow: Complete Accounting Cycle

### 1. User Registration & Authentication

**Test Case 1.1: Register New User**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "accountant@test.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "Accountant"
  }'
```

**Expected:** 201 Created, user object returned

**Test Case 1.2: Login**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "accountant@test.com",
    "password": "Test123!"
  }'
```

**Expected:** 200 OK, JWT token returned

**Save the token for subsequent requests!**

---

### 2. Company & Fiscal Year Setup

**Test Case 2.1: Get Demo Company**
```bash
curl -X GET http://localhost:3000/companies \
  -H "Authorization: Bearer {YOUR_TOKEN}"
```

**Expected:** 200 OK, Demo Company Ltd. returned

**Test Case 2.2: Create Fiscal Year**
```bash
curl -X POST http://localhost:3000/fiscal-years \
  -H "Authorization: Bearer {YOUR_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "name": "FY 2024",
    "isClosed": false
  }'
```

**Expected:** 201 Created, fiscal year object returned

**Save fiscal year ID!**

---

### 3. Chart of Accounts

**Test Case 3.1: List All Accounts**
```bash
curl -X GET http://localhost:3000/accounts \
  -H "Authorization: Bearer {YOUR_TOKEN}"
```

**Expected:** 200 OK, 72 accounts returned

**Test Case 3.2: View Cash Account**
```bash
curl -X GET "http://localhost:3000/accounts?code=1110-01" \
  -H "Authorization: Bearer {YOUR_TOKEN}"
```

**Expected:** 200 OK, "Cash on Hand" account returned

**Save account IDs for:**
- Cash on Hand (1110-01)
- Trade Receivables (1120-01)
- Product Sales (4110-01)
- Salaries & Wages (5220-01)

---

### 4. Master Data Setup

**Test Case 4.1: Create Customer**
```bash
curl -X POST http://localhost:3000/customers \
  -H "Authorization: Bearer {YOUR_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "CUST-001",
    "name": "ABC Corporation",
    "email": "contact@abc.com",
    "phone": "+1-555-0100",
    "address": "123 Business St",
    "creditLimit": 50000,
    "paymentTerms": 30
  }'
```

**Expected:** 201 Created, customer object returned

**Test Case 4.2: Create Supplier**
```bash
curl -X POST http://localhost:3000/suppliers \
  -H "Authorization: Bearer {YOUR_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SUP-001",
    "name": "XYZ Suppliers Ltd",
    "email": "sales@xyz.com",
    "phone": "+1-555-0200",
    "address": "456 Supplier Ave",
    "creditLimit": 100000,
    "paymentTerms": 60
  }'
```

**Expected:** 201 Created, supplier object returned

**Test Case 4.3: Create Tax Category**
```bash
curl -X POST http://localhost:3000/tax-categories \
  -H "Authorization: Bearer {YOUR_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "VAT",
    "name": "Value Added Tax",
    "rate": 15.00,
    "isActive": true
  }'
```

**Expected:** 201 Created, tax category returned

**Test Case 4.4: Create Item**
```bash
curl -X POST http://localhost:3000/items \
  -H "Authorization: Bearer {YOUR_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "PROD-001",
    "name": "Premium Widget",
    "description": "High-quality widget",
    "unit": "pcs",
    "costPrice": 50.00,
    "sellingPrice": 100.00,
    "stockQuantity": 100,
    "reorderLevel": 10,
    "taxCategoryId": "{TAX_CATEGORY_ID}"
  }'
```

**Expected:** 201 Created, item created

---

### 5. Journal Entry Creation

**Test Case 5.1: Simple Cash Sale Entry**
```bash
curl -X POST http://localhost:3000/journal-entries \
  -H "Authorization: Bearer {YOUR_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "voucherTypeId": "{RV_VOUCHER_TYPE_ID}",
    "fiscalYearId": "{FISCAL_YEAR_ID}",
    "entryDate": "2024-12-02",
    "referenceNo": "SALE-001",
    "description": "Cash sale to customer",
    "lines": [
      {
        "accountId": "{CASH_ACCOUNT_ID}",
        "debit": 1000.00,
        "credit": 0,
        "description": "Cash received"
      },
      {
        "accountId": "{SALES_ACCOUNT_ID}",
        "debit": 0,
        "credit": 1000.00,
        "description": "Sales revenue"
      }
    ]
  }'
```

**Expected:** 201 Created, journal entry with auto-generated voucher number

**Test Case 5.2: Validate Unbalanced Entry (Should Fail)**
```bash
curl -X POST http://localhost:3000/journal-entries \
  -H "Authorization: Bearer {YOUR_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "voucherTypeId": "{JV_VOUCHER_TYPE_ID}",
    "fiscalYearId": "{FISCAL_YEAR_ID}",
    "entryDate": "2024-12-02",
    "description": "Unbalanced entry test",
    "lines": [
      {
        "accountId": "{CASH_ACCOUNT_ID}",
        "debit": 1000.00,
        "credit": 0,
        "description": "Debit side"
      },
      {
        "accountId": "{SALES_ACCOUNT_ID}",
        "debit": 0,
        "credit": 500.00,
        "description": "Credit side - unbalanced"
      }
    ]
  }'
```

**Expected:** 400 Bad Request, "Debits must equal credits" error

**Test Case 5.3: Approve Journal Entry**
```bash
curl -X PATCH http://localhost:3000/journal-entries/{ENTRY_ID}/approve \
  -H "Authorization: Bearer {YOUR_TOKEN}"
```

**Expected:** 200 OK, entry status changed to "approved"

**Test Case 5.4: Post Journal Entry**
```bash
curl -X PATCH http://localhost:3000/journal-entries/{ENTRY_ID}/post \
  -H "Authorization: Bearer {YOUR_TOKEN}"
```

**Expected:** 200 OK, entry status changed to "posted"

---

### 6. Sales Invoice Creation

**Test Case 6.1: Create Sales Invoice**
```bash
curl -X POST http://localhost:3000/invoices \
  -H "Authorization: Bearer {YOUR_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceNo": "SI-001",
    "type": "sales",
    "customerId": "{CUSTOMER_ID}",
    "invoiceDate": "2024-12-02",
    "dueDate": "2025-01-02",
    "lines": [
      {
        "itemId": "{ITEM_ID}",
        "description": "Premium Widget",
        "quantity": 10,
        "unitPrice": 100.00,
        "taxCategoryId": "{TAX_CATEGORY_ID}"
      }
    ],
    "notes": "Payment due in 30 days"
  }'
```

**Expected:** 201 Created, invoice and automatic journal entry created

**Test Case 6.2: Get Invoice PDF**
```bash
curl -X GET http://localhost:3000/invoices/{INVOICE_ID}/pdf \
  -H "Authorization: Bearer {YOUR_TOKEN}" \
  -o invoice.pdf
```

**Expected:** 200 OK, PDF file downloaded

**Test Case 6.3: Mark Invoice as Paid**
```bash
curl -X PATCH http://localhost:3000/invoices/{INVOICE_ID}/pay \
  -H "Authorization: Bearer {YOUR_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentDate": "2024-12-02",
    "paymentAmount": 1150.00,
    "paymentMethod": "bank_transfer"
  }'
```

**Expected:** 200 OK, invoice status updated to "paid"

---

### 7. Purchase Invoice

**Test Case 7.1: Create Purchase Invoice**
```bash
curl -X POST http://localhost:3000/invoices \
  -H "Authorization: Bearer {YOUR_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceNo": "PI-001",
    "type": "purchase",
    "supplierId": "{SUPPLIER_ID}",
    "invoiceDate": "2024-12-02",
    "dueDate": "2025-01-02",
    "lines": [
      {
        "itemId": "{ITEM_ID}",
        "description": "Raw materials",
        "quantity": 50,
        "unitPrice": 50.00,
        "taxCategoryId": "{TAX_CATEGORY_ID}"
      }
    ]
  }'
```

**Expected:** 201 Created, purchase invoice created

---

### 8. Financial Reports

**Test Case 8.1: Trial Balance**
```bash
curl -X GET "http://localhost:3000/reports/trial-balance?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer {YOUR_TOKEN}"
```

**Expected:** 200 OK, trial balance with all accounts (debits = credits)

**Test Case 8.2: Income Statement**
```bash
curl -X GET "http://localhost:3000/reports/income-statement?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer {YOUR_TOKEN}"
```

**Expected:** 200 OK, P&L statement showing revenues, expenses, and net income

**Test Case 8.3: Balance Sheet**
```bash
curl -X GET "http://localhost:3000/reports/balance-sheet?asOfDate=2024-12-31" \
  -H "Authorization: Bearer {YOUR_TOKEN}"
```

**Expected:** 200 OK, balance sheet (Assets = Liabilities + Equity)

**Test Case 8.4: General Ledger**
```bash
curl -X GET "http://localhost:3000/reports/general-ledger/{CASH_ACCOUNT_ID}?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer {YOUR_TOKEN}"
```

**Expected:** 200 OK, all transactions for the account

**Test Case 8.5: AR Aging Report**
```bash
curl -X GET "http://localhost:3000/reports/ar-aging?asOfDate=2024-12-31" \
  -H "Authorization: Bearer {YOUR_TOKEN}"
```

**Expected:** 200 OK, customer balances by aging period

**Test Case 8.6: AP Aging Report**
```bash
curl -X GET "http://localhost:3000/reports/ap-aging?asOfDate=2024-12-31" \
  -H "Authorization: Bearer {YOUR_TOKEN}"
```

**Expected:** 200 OK, supplier balances by aging period

---

### 9. Inventory Management

**Test Case 9.1: Check Stock Levels**
```bash
curl -X GET http://localhost:3000/items \
  -H "Authorization: Bearer {YOUR_TOKEN}"
```

**Expected:** 200 OK, all items with current stock

**Test Case 9.2: Low Stock Items**
```bash
curl -X GET http://localhost:3000/items/low-stock \
  -H "Authorization: Bearer {YOUR_TOKEN}"
```

**Expected:** 200 OK, items below reorder level

**Test Case 9.3: Stock Adjustment**
```bash
curl -X PATCH http://localhost:3000/items/{ITEM_ID}/stock \
  -H "Authorization: Bearer {YOUR_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 50,
    "type": "in"
  }'
```

**Expected:** 200 OK, stock updated

---

### 10. Project Tracking

**Test Case 10.1: Create Project**
```bash
curl -X POST http://localhost:3000/projects \
  -H "Authorization: Bearer {YOUR_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "PROJ-2024-001",
    "name": "Office Renovation",
    "description": "Complete office renovation project",
    "startDate": "2024-01-01",
    "endDate": "2024-06-30",
    "budget": 100000,
    "isActive": true
  }'
```

**Expected:** 201 Created, project created

**Test Case 10.2: Get Project Variance**
```bash
curl -X GET http://localhost:3000/projects/{PROJECT_ID}/variance \
  -H "Authorization: Bearer {YOUR_TOKEN}"
```

**Expected:** 200 OK, budget vs actual comparison

---

### 11. Bank Reconciliation

**Test Case 11.1: Create Reconciliation**
```bash
curl -X POST http://localhost:3000/reconciliations \
  -H "Authorization: Bearer {YOUR_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "{BANK_ACCOUNT_ID}",
    "statementDate": "2024-12-31",
    "statementBalance": 50000.00,
    "items": []
  }'
```

**Expected:** 201 Created, reconciliation record created

---

### 12. Fixed Assets & Depreciation

**Test Case 12.1: Create Fixed Asset**
```bash
curl -X POST http://localhost:3000/fixed-assets \
  -H "Authorization: Bearer {YOUR_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "FA-001",
    "name": "Company Vehicle",
    "assetType": "vehicle",
    "purchaseDate": "2024-01-01",
    "purchasePrice": 30000,
    "depreciationMethod": "straight_line",
    "usefulLife": 5,
    "salvageValue": 3000
  }'
```

**Expected:** 201 Created, asset created

**Test Case 12.2: Calculate Depreciation**
```bash
curl -X POST http://localhost:3000/fixed-assets/{ASSET_ID}/depreciate \
  -H "Authorization: Bearer {YOUR_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "depreciationDate": "2024-12-31"
  }'
```

**Expected:** 200 OK, depreciation entry created

---

## Integration Test Scenarios

### Scenario 1: Complete Sales Cycle
1. Create customer
2. Create item
3. Create sales invoice
4. Verify journal entry auto-created
5. Check customer balance
6. Receive payment
7. Verify invoice marked as paid
8. Check AR aging report

### Scenario 2: Complete Purchase Cycle
1. Create supplier
2. Create item
3. Create purchase invoice
4. Verify journal entry created
5. Check supplier balance
6. Make payment
7. Verify invoice paid
8. Check AP aging report

### Scenario 3: Month-End Closing
1. Create all journal entries for the month
2. Post all entries
3. Generate trial balance
4. Generate P&L
5. Generate balance sheet
6. Verify double-entry balance
7. Calculate depreciation
8. Run all reports

---

## Performance Tests

### Test Case P.1: Bulk Journal Entries
- Create 1000 journal entries
- Expected: < 10 seconds total
- Each entry should process in < 100ms

### Test Case P.2: Large Report Generation
- Generate trial balance with 1000+ accounts
- Expected: < 5 seconds
- Memory usage: < 500MB

### Test Case P.3: Concurrent Users
- 50 concurrent users creating entries
- Expected: No database deadlocks
- All transactions should complete successfully

---

## Validation Tests

### Test Case V.1: Double-Entry Validation
✅ Reject unbalanced entries
✅ Debit must equal credit
✅ Both debit and credit cannot be non-zero on same line

### Test Case V.2: Fiscal Year Validation
✅ Reject entries outside fiscal year
✅ Reject entries in closed fiscal year
✅ Prevent fiscal year overlap

### Test Case V.3: Account Hierarchy Validation
✅ Level 1 accounts cannot have parents
✅ Only Level 4 accounts are posting accounts
✅ Cannot post to parent accounts

### Test Case V.4: Posting Lock
✅ Posted entries cannot be edited
✅ Posted entries cannot be deleted
✅ Must reverse posted entries

---

## Security Tests

### Test Case S.1: Authentication
✅ Reject invalid credentials
✅ Token expires after timeout
✅ Refresh token mechanism

### Test Case S.2: Authorization
✅ Users can only access their company data
✅ Role-based permissions enforced
✅ Admin vs regular user capabilities

### Test Case S.3: Rate Limiting
✅ 100 requests per 15 minutes enforced
✅ 429 status returned when exceeded

---

## Error Handling Tests

### Test Case E.1: Invalid Data
- Missing required fields → 400 Bad Request
- Invalid UUIDs → 400 Bad Request
- Invalid dates → 400 Bad Request

### Test Case E.2: Not Found
- Invalid IDs → 404 Not Found
- Deleted resources → 404 Not Found

### Test Case E.3: Business Logic Errors
- Duplicate codes → 409 Conflict
- Insufficient balance → 400 Bad Request
- Closed fiscal year → 400 Bad Request

---

## Success Criteria

✅ All endpoints return correct status codes
✅ All validations working correctly
✅ Double-entry balance maintained
✅ Reports calculate correctly
✅ Invoices generate proper journal entries
✅ No data corruption
✅ Audit trail complete
✅ Multi-company isolation working
✅ Performance within acceptable limits
✅ Security validations pass

---

## Automated Testing

Run unit tests:
```bash
npm run test
```

Run e2e tests:
```bash
npm run test:e2e
```

Run test coverage:
```bash
npm run test:cov
```

---

## Common Issues & Solutions

**Issue:** "Fiscal year not found"
**Solution:** Create fiscal year for the entry date

**Issue:** "Debits must equal credits"
**Solution:** Verify total debits = total credits in journal lines

**Issue:** "Account is not a posting account"
**Solution:** Use only Level 4 accounts for journal lines

**Issue:** "Entry is already posted"
**Solution:** Cannot modify posted entry - create reversal

**Issue:** "Fiscal year is closed"
**Solution:** Cannot post to closed period - use next period
