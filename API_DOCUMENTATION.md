# Double-Entry Accounting System - API Documentation

## Overview

Comprehensive REST API for a production-ready double-entry accounting system built with NestJS, PostgreSQL, and TypeORM.

**Base URL:** `http://localhost:3000`

**Authentication:** Bearer token (JWT)

---

## 🔐 Authentication

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Profile
```http
GET /auth/profile
Authorization: Bearer {token}
```

---

## 🏢 Companies

### Create Company
```http
POST /companies
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Acme Corporation",
  "legalName": "Acme Corporation Ltd.",
  "registrationNo": "REG-12345",
  "taxRegistrationNo": "TAX-12345",
  "countryCode": "US",
  "currencyCode": "USD",
  "fiscalYearStartMonth": 1,
  "address": "123 Main St, City, State 12345",
  "phone": "+1-555-0100",
  "email": "info@acme.com"
}
```

### Get All Companies
```http
GET /companies
Authorization: Bearer {token}
```

### Get Company by ID
```http
GET /companies/:id
Authorization: Bearer {token}
```

### Update Company
```http
PATCH /companies/:id
Authorization: Bearer {token}
```

### Delete Company
```http
DELETE /companies/:id
Authorization: Bearer {token}
```

---

## 📅 Fiscal Years

### Create Fiscal Year
```http
POST /fiscal-years
Authorization: Bearer {token}
Content-Type: application/json

{
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "name": "FY 2024",
  "isClosed": false
}
```

### Get All Fiscal Years
```http
GET /fiscal-years
Authorization: Bearer {token}
```

### Close Fiscal Year
```http
PATCH /fiscal-years/:id/close
Authorization: Bearer {token}
```

---

## 📊 Chart of Accounts

### Create Account
```http
POST /accounts
Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "1110-01",
  "name": "Cash on Hand",
  "type": "asset",
  "level": "4",
  "parentId": "uuid-of-parent-account",
  "isPosting": true,
  "isActive": true
}
```

### Get All Accounts
```http
GET /accounts
Authorization: Bearer {token}
```

### Get Account by ID
```http
GET /accounts/:id
Authorization: Bearer {token}
```

---

## 📝 Voucher Management

### Create Voucher Type
```http
POST /voucher-types
Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "PV",
  "name": "Payment Voucher",
  "nature": "payment",
  "prefix": "PV",
  "autoNumbering": true,
  "requiresApproval": true
}
```

### Get All Voucher Types
```http
GET /voucher-types
Authorization: Bearer {token}
```

### Create Journal Entry
```http
POST /journal-entries
Authorization: Bearer {token}
Content-Type: application/json

{
  "voucherTypeId": "uuid-of-voucher-type",
  "fiscalYearId": "uuid-of-fiscal-year",
  "entryDate": "2024-12-02",
  "referenceNo": "INV-001",
  "description": "Payment for supplies",
  "lines": [
    {
      "accountId": "uuid-of-account",
      "debit": 1000.00,
      "credit": 0,
      "description": "Supplies purchased"
    },
    {
      "accountId": "uuid-of-cash-account",
      "debit": 0,
      "credit": 1000.00,
      "description": "Cash payment"
    }
  ]
}
```

### Get All Journal Entries
```http
GET /journal-entries
Authorization: Bearer {token}
```

### Approve Journal Entry
```http
PATCH /journal-entries/:id/approve
Authorization: Bearer {token}
```

### Post Journal Entry
```http
PATCH /journal-entries/:id/post
Authorization: Bearer {token}
```

---

## 👥 Customers

### Create Customer
```http
POST /customers
Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "CUST-001",
  "name": "ABC Company",
  "email": "contact@abc.com",
  "phone": "+1-555-0123",
  "address": "123 Customer St",
  "creditLimit": 50000,
  "paymentTerms": 30
}
```

### Get All Customers
```http
GET /customers
Authorization: Bearer {token}
```

### Get Customers with Balance
```http
GET /customers/with-balance
Authorization: Bearer {token}
```

### Update Customer
```http
PATCH /customers/:id
Authorization: Bearer {token}
```

### Delete Customer
```http
DELETE /customers/:id
Authorization: Bearer {token}
```

---

## 🏭 Suppliers

### Create Supplier
```http
POST /suppliers
Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "SUP-001",
  "name": "XYZ Suppliers",
  "email": "sales@xyz.com",
  "phone": "+1-555-0456",
  "address": "456 Supplier Ave",
  "creditLimit": 100000,
  "paymentTerms": 60
}
```

### Get All Suppliers
```http
GET /suppliers
Authorization: Bearer {token}
```

### Get Suppliers with Balance
```http
GET /suppliers/with-balance
Authorization: Bearer {token}
```

---

## 💰 Tax Categories

### Create Tax Category
```http
POST /tax-categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "VAT",
  "name": "Value Added Tax",
  "rate": 15.00,
  "isActive": true
}
```

### Get All Tax Categories
```http
GET /tax-categories
Authorization: Bearer {token}
```

---

## 📦 Items

### Create Item
```http
POST /items
Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "ITEM-001",
  "name": "Product A",
  "description": "High quality product",
  "unit": "pcs",
  "costPrice": 50.00,
  "sellingPrice": 100.00,
  "stockQuantity": 100,
  "reorderLevel": 10,
  "taxCategoryId": "uuid-of-tax-category"
}
```

### Get All Items
```http
GET /items
Authorization: Bearer {token}
```

### Get Low Stock Items
```http
GET /items/low-stock
Authorization: Bearer {token}
```

### Update Stock
```http
PATCH /items/:id/stock
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 50,
  "type": "in"  // or "out"
}
```

---

## 🏗️ Projects

### Create Project
```http
POST /projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "PROJ-001",
  "name": "Project Alpha",
  "description": "Major development project",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "budget": 500000,
  "isActive": true
}
```

### Get All Projects
```http
GET /projects
Authorization: Bearer {token}
```

### Get Project Variance
```http
GET /projects/:id/variance
Authorization: Bearer {token}
```

---

## 💼 Cost Centers

### Create Cost Center
```http
POST /cost-centers
Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "CC-001",
  "name": "Sales Department",
  "description": "Sales and marketing operations",
  "isActive": true
}
```

### Get All Cost Centers
```http
GET /cost-centers
Authorization: Bearer {token}
```

---

## 🧾 Invoices

### Create Sales Invoice
```http
POST /invoices
Authorization: Bearer {token}
Content-Type: application/json

{
  "invoiceNo": "INV-001",
  "type": "sales",
  "customerId": "uuid-of-customer",
  "invoiceDate": "2024-12-02",
  "dueDate": "2025-01-02",
  "lines": [
    {
      "itemId": "uuid-of-item",
      "description": "Product A",
      "quantity": 10,
      "unitPrice": 100.00,
      "taxCategoryId": "uuid-of-tax"
    }
  ],
  "notes": "Payment due in 30 days"
}
```

### Get All Invoices
```http
GET /invoices
Authorization: Bearer {token}
```

### Get Invoice PDF
```http
GET /invoices/:id/pdf
Authorization: Bearer {token}
```

### Mark Invoice as Paid
```http
PATCH /invoices/:id/pay
Authorization: Bearer {token}
Content-Type: application/json

{
  "paymentDate": "2024-12-02",
  "paymentAmount": 1150.00,
  "paymentMethod": "bank_transfer"
}
```

---

## 📈 Financial Reports

### Trial Balance
```http
GET /reports/trial-balance?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer {token}
```

### Income Statement (P&L)
```http
GET /reports/income-statement?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer {token}
```

### Balance Sheet
```http
GET /reports/balance-sheet?asOfDate=2024-12-31
Authorization: Bearer {token}
```

### General Ledger
```http
GET /reports/general-ledger/:accountId?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer {token}
```

### AR Aging Report
```http
GET /reports/ar-aging?asOfDate=2024-12-31
Authorization: Bearer {token}
```

### AP Aging Report
```http
GET /reports/ap-aging?asOfDate=2024-12-31
Authorization: Bearer {token}
```

### Journal Register
```http
GET /reports/journal-register?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer {token}
```

### Day Book
```http
GET /reports/day-book?date=2024-12-02
Authorization: Bearer {token}
```

---

## 🔄 Bank Reconciliation

### Create Reconciliation
```http
POST /reconciliations
Authorization: Bearer {token}
Content-Type: application/json

{
  "accountId": "uuid-of-bank-account",
  "statementDate": "2024-12-31",
  "statementBalance": 50000.00,
  "items": [
    {
      "entryId": "uuid-of-journal-entry",
      "isReconciled": true,
      "reconciledDate": "2024-12-31"
    }
  ]
}
```

### Get All Reconciliations
```http
GET /reconciliations
Authorization: Bearer {token}
```

---

## 🏢 Fixed Assets

### Create Fixed Asset
```http
POST /fixed-assets
Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "FA-001",
  "name": "Office Building",
  "assetType": "building",
  "purchaseDate": "2020-01-01",
  "purchasePrice": 500000,
  "depreciationMethod": "straight_line",
  "usefulLife": 20,
  "salvageValue": 50000
}
```

### Get All Fixed Assets
```http
GET /fixed-assets
Authorization: Bearer {token}
```

### Calculate Depreciation
```http
POST /fixed-assets/:id/depreciate
Authorization: Bearer {token}
Content-Type: application/json

{
  "depreciationDate": "2024-12-31"
}
```

---

## 💵 Currencies

### Create Currency
```http
POST /currencies
Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "EUR",
  "name": "Euro",
  "symbol": "€",
  "isActive": true
}
```

### Get Exchange Rate
```http
GET /currencies/exchange-rate?from=USD&to=EUR&date=2024-12-02
Authorization: Bearer {token}
```

---

## 📊 Budgets

### Create Budget
```http
POST /budgets
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "FY 2024 Budget",
  "fiscalYearId": "uuid-of-fiscal-year",
  "lines": [
    {
      "accountId": "uuid-of-account",
      "budgetedAmount": 100000,
      "period": "annual"
    }
  ]
}
```

### Get Budget vs Actual
```http
GET /budgets/:id/variance
Authorization: Bearer {token}
```

---

## 📊 Account Balances

### Get Account Balance
```http
GET /balances/account/:accountId?asOfDate=2024-12-31
Authorization: Bearer {token}
```

### Recalculate All Balances
```http
POST /balances/recalculate
Authorization: Bearer {token}
```

---

## 👥 User Management

### Create User
```http
POST /users
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "accountant"
}
```

### Get All Users
```http
GET /users
Authorization: Bearer {token}
```

### Update User
```http
PATCH /users/:id
Authorization: Bearer {token}
```

---

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid or missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

---

## Rate Limiting

- 100 requests per 15 minutes per IP address
- Authenticated users: 10 requests per minute

---

## Notes

- All dates should be in ISO 8601 format (YYYY-MM-DD)
- All monetary amounts are in 2 decimal places
- All IDs are UUIDs
- Multi-company support: User context determines which company data is accessed
- Fiscal year validation: All transactions must be within an open fiscal year
- Double-entry validation: Debit must equal credit in all journal entries
- Posting validation: Posted entries cannot be modified or deleted

---

## Seed Data Available

After running `npm run seed:run`, the following data is available:

**Demo Company:**
- Name: Demo Company Ltd.
- Registration No: DEMO-001

**Voucher Types:**
- PV - Payment Voucher
- RV - Receipt Voucher  
- JV - Journal Voucher
- CV - Contra Voucher
- SV - Sales Voucher
- PUR - Purchase Voucher

**Chart of Accounts:** 72 accounts (complete US GAAP structure)
- Assets (1000-1999)
- Liabilities (2000-2999)
- Equity (3000-3999)
- Revenue/Income (4000-4999)
- Expenses (5000-5999)
