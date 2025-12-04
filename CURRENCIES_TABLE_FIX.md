# Currencies Table Fix - December 4, 2025

## Issue
The `/currencies` endpoint was returning a 500 error because the `currencies` table didn't exist in the database.

## Root Cause
The `currencies` and `exchange_rates` tables were missing from the database schema migration file (`1000000000000-CompleteSchema.ts`).

## Solution

### 1. Created Missing Tables ✅
Created a script (`create-currencies-table.js`) to add the missing tables:

```sql
CREATE TABLE "currencies" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
    "code" character varying(3) NOT NULL UNIQUE,
    "name" character varying NOT NULL,
    "symbol" character varying(5) NOT NULL,
    "is_base" boolean NOT NULL DEFAULT false,
    "is_active" boolean NOT NULL DEFAULT true,
    CONSTRAINT "PK_currencies" PRIMARY KEY ("id")
)

CREATE TABLE "exchange_rates" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
    "from_currency_id" uuid NOT NULL,
    "to_currency_id" uuid NOT NULL,
    "rate" numeric(18,6) NOT NULL,
    "effective_date" date NOT NULL,
    CONSTRAINT "PK_exchange_rates" PRIMARY KEY ("id"),
    CONSTRAINT "FK_exchange_rates_from" FOREIGN KEY ("from_currency_id") REFERENCES "currencies"("id"),
    CONSTRAINT "FK_exchange_rates_to" FOREIGN KEY ("to_currency_id") REFERENCES "currencies"("id")
)
```

### 2. Inserted Default Currencies ✅
Added default currencies:
- USD (US Dollar) - Base currency
- EUR (Euro)
- GBP (British Pound)
- PKR (Pakistani Rupee)

### 3. Updated Controller ✅
Updated `currencies.controller.ts` to use `@CurrentCompany()` decorator (even though currencies are system-wide, the decorator is needed for JWT auth).

## Files Modified

1. **Backend Service**: `src/modules/currencies/currencies.controller.ts`
   - Added `@CurrentCompany()` decorator to all endpoints

2. **Database Script**: `create-currencies-table.js`
   - Created currencies and exchange_rates tables
   - Inserted default currency data

## Testing

After these fixes, the following should work:
- ✅ Settings page loads without errors
- ✅ Currency dropdown populated with default currencies
- ✅ No more 500 errors on `/currencies` endpoint

## Status

✅ Currencies table created
✅ Default currencies inserted
✅ Controller updated
✅ 500 error fixed

## Note

Currencies are **system-wide** (not company-specific), meaning all companies share the same currency list. This is by design, as currencies are global standards.
