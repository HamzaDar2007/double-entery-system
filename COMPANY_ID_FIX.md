# Backend Services - Company ID Null Check Fix

## Summary
Applied null checks to all service methods that accept `companyId` as a parameter to prevent 500 errors when users don't have a company assigned.

## Services Fixed

### ✅ Already Fixed:
1. **journal-entries.service.ts** - `findAll()`
2. **customers.service.ts** - `findAll()`, `getCustomersWithBalance()`
3. **accounts.service.ts** - `findAll()`
4. **current-company.decorator.ts** - Returns `null` instead of `undefined`

### 🔧 Need to Fix:
The following services also need the same fix pattern:

1. **suppliers.service.ts** - `findAll()`, `getSuppliersWithBalance()`
2. **items.service.ts** - `findAll()`
3. **projects.service.ts** - `findAll()`
4. **cost-centers.service.ts** - `findAll()`
5. **fixed-assets.service.ts** - `findAll()`
6. **budgets.service.ts** - `findAll()`
7. **reconciliations.service.ts** - `findAll()`
8. **invoices.service.ts** - `findAll()`
9. **tax-categories.service.ts** - `findAll()`
10. **currencies.service.ts** - `findAll()`
11. **fiscal-years.service.ts** - `findAll()`
12. **voucher-types.service.ts** - `findAll()`

## Fix Pattern

For each `findAll()` method that accepts `companyId`, add this check at the beginning:

```typescript
async findAll(companyId: string): Promise<EntityType[]> {
    // Return empty array if no company is assigned
    if (!companyId) {
        return [];
    }
    
    // ... rest of the method
}
```

## Why This Fix?

New users don't have a company assigned by default. When they access pages that fetch data (Customers, Suppliers, Dashboard, etc.), the `@CurrentCompany()` decorator returns `null`. Without this check, the services try to query the database with a null company ID, causing a 500 Internal Server Error.

By returning an empty array when `companyId` is null, the frontend gracefully displays "No items found" instead of crashing.

## Testing

After applying fixes, test by:
1. Register a new user
2. Login
3. Navigate to each page (Dashboard, Customers, Suppliers, etc.)
4. Verify no 500 errors in console
5. Pages should show "No items found" messages

## Future Enhancement

Consider implementing a proper company assignment flow:
- Auto-create a default company for new users during registration
- Add a company selection UI for users with multiple companies
- Add middleware to set `request.companyId` from user's default company
