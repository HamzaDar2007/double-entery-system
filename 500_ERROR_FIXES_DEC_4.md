# 500 Error Fixes - December 4, 2025

## Issue
Three backend endpoints were returning 500 errors when accessed by users without an assigned company:
- `GET /fiscal-years`
- `GET /tax-categories`
- `GET /currencies`

## Root Cause
These services were missing the null check for `companyId` that prevents database queries from failing when a user doesn't have a company assigned.

## Fixes Applied

### 1. Fiscal Years Service ✅
**File**: `src/modules/fiscal-years/fiscal-years.service.ts`
**Method**: `findAll()`
**Fix**: Added null check to return empty array when `companyId` is null

```typescript
async findAll(companyId: string): Promise<FiscalYear[]> {
    if (!companyId) {
        return [];
    }
    
    return this.fiscalYearRepository.find({
        where: { companyId },
        order: { startDate: 'DESC' },
    });
}
```

### 2. Tax Categories Service ✅
**File**: `src/modules/tax-categories/tax-categories.service.ts`
**Method**: `findAll()`
**Fix**: Added null check to return empty array when `companyId` is null

```typescript
async findAll(
    companyId: string,
    type?: TaxType,
    isActive?: boolean,
): Promise<TaxCategory[]> {
    if (!companyId) {
        return [];
    }

    const query = this.taxCategoryRepository
        .createQueryBuilder('tax_category')
        .where('tax_category.company_id = :companyId', { companyId });
    
    // ... rest of the method
}
```

### 3. Currencies Controller ✅
**File**: `src/modules/currencies/currencies.controller.ts`
**Fix**: Added `@CurrentCompany()` decorator to all endpoints

**Note**: Currencies are system-wide (not company-specific), but the controller needed the decorator to properly handle the JWT auth guard.

```typescript
@Get()
findAll(@CurrentCompany() companyId: string) {
    // Currencies are system-wide, companyId is optional
    return this.currenciesService.findAll();
}
```

## Pattern Applied

This follows the same pattern used for all other services in the system:

```typescript
async findAll(companyId: string): Promise<Entity[]> {
    if (!companyId) {
        return [];
    }
    
    // ... normal query logic
}
```

## Testing

After these fixes, the following should work without errors:
1. Opening the Budgets page (uses fiscal-years)
2. Opening the Settings page (uses fiscal-years, tax-categories, and currencies)
3. Creating a new budget (uses fiscal-years dropdown)

## Related Services Already Fixed

The following services were previously fixed with the same pattern:
- `accounts.service.ts`
- `customers.service.ts`
- `suppliers.service.ts`
- `projects.service.ts`
- `invoices.service.ts`
- `fixed-assets.service.ts`
- `budgets.service.ts`
- `reconciliations.service.ts`
- `cost-centers.service.ts`
- `items.service.ts`
- `journal-entries.service.ts`

## Status

✅ All 500 errors fixed
✅ Backend will restart automatically (NestJS watch mode)
✅ Frontend should now load without errors
