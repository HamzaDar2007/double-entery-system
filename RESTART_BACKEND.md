# Backend Restart Instructions

## Issue
The `/currencies` endpoint returns 500 error even though the table exists in the database.

## Root Cause
TypeORM caches the database schema when the application starts. Since the `currencies` table was created after the backend started, TypeORM doesn't know about it.

## Solution
**Restart the backend server** to reload the schema.

### Option 1: Manual Restart (Recommended)
1. Stop the backend terminal (Ctrl+C)
2. Run: `npm run start:dev`

### Option 2: Kill and Restart
```powershell
# Find the backend process
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Where-Object {$_.Path -like "*backend*"}

# Kill it (replace PID with actual process ID)
Stop-Process -Id <PID>

# Restart
npm run start:dev
```

### Option 3: Use the existing terminal
If you have a terminal running `npm run start:dev`:
1. Press `Ctrl+C` to stop
2. Press `Up Arrow` to recall the command
3. Press `Enter` to restart

## Verification
After restart, test the endpoint:
```bash
curl http://localhost:3000/currencies
```

You should see a list of currencies (USD, EUR, GBP, PKR).

## What Was Fixed
✅ Created `currencies` table
✅ Created `exchange_rates` table  
✅ Inserted 4 default currencies
✅ Updated controller to use `@CurrentCompany()` decorator
✅ Added null checks to fiscal-years and tax-categories services

## Files Modified
- `src/modules/currencies/currencies.controller.ts`
- `src/modules/fiscal-years/fiscal-years.service.ts`
- `src/modules/tax-categories/tax-categories.service.ts`
- Database: Added `currencies` and `exchange_rates` tables
