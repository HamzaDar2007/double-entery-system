import { MigrationInterface, QueryRunner } from 'typeorm';

export class CompleteSchema1000000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Enable UUID extension
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // 1. Companies
        await queryRunner.query(`
            CREATE TABLE "companies" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying NOT NULL,
                "email" character varying,
                "phone" character varying,
                "address" text,
                "tax_id" character varying,
                "currency" character varying NOT NULL DEFAULT 'USD',
                "fiscal_year_start_month" integer NOT NULL DEFAULT 1,
                "logo_url" character varying,
                CONSTRAINT "PK_companies" PRIMARY KEY ("id")
            )
        `);

        // 2. Users
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "first_name" character varying NOT NULL,
                "last_name" character varying NOT NULL,
                "role" character varying NOT NULL DEFAULT 'USER',
                "is_active" boolean NOT NULL DEFAULT true,
                CONSTRAINT "UQ_users_email" UNIQUE ("email"),
                CONSTRAINT "PK_users" PRIMARY KEY ("id")
            )
        `);

        // 3. User Companies
        await queryRunner.query(`
            CREATE TABLE "user_companies" (
                "user_id" uuid NOT NULL,
                "company_id" uuid NOT NULL,
                CONSTRAINT "PK_user_companies" PRIMARY KEY ("user_id", "company_id"),
                CONSTRAINT "FK_user_companies_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_user_companies_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE
            )
        `);

        // 4. Fiscal Years
        await queryRunner.query(`
            CREATE TABLE "fiscal_years" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying NOT NULL,
                "start_date" date NOT NULL,
                "end_date" date NOT NULL,
                "is_closed" boolean NOT NULL DEFAULT false,
                "company_id" uuid NOT NULL,
                CONSTRAINT "PK_fiscal_years" PRIMARY KEY ("id"),
                CONSTRAINT "FK_fiscal_years_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE
            )
        `);

        // 5. Tax Categories
        await queryRunner.query(`
            CREATE TABLE "tax_categories" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying NOT NULL,
                "rate" numeric(5,2) NOT NULL DEFAULT '0',
                "description" text,
                "is_active" boolean NOT NULL DEFAULT true,
                "company_id" uuid NOT NULL,
                CONSTRAINT "PK_tax_categories" PRIMARY KEY ("id"),
                CONSTRAINT "FK_tax_categories_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE
            )
        `);

        // 6. Accounts
        await queryRunner.query(`
            CREATE TABLE "accounts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "code" character varying NOT NULL,
                "name" character varying NOT NULL,
                "type" character varying NOT NULL,
                "description" text,
                "is_active" boolean NOT NULL DEFAULT true,
                "parent_id" uuid,
                "company_id" uuid NOT NULL,
                "initial_balance" numeric(18,2) NOT NULL DEFAULT '0',
                "current_balance" numeric(18,2) NOT NULL DEFAULT '0',
                CONSTRAINT "PK_accounts" PRIMARY KEY ("id"),
                CONSTRAINT "FK_accounts_parent" FOREIGN KEY ("parent_id") REFERENCES "accounts"("id"),
                CONSTRAINT "FK_accounts_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE
            )
        `);

        // 7. Voucher Types
        await queryRunner.query(`
            CREATE TABLE "voucher_types" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "code" character varying NOT NULL,
                "name" character varying NOT NULL,
                "description" text,
                "company_id" uuid NOT NULL,
                CONSTRAINT "PK_voucher_types" PRIMARY KEY ("id"),
                CONSTRAINT "FK_voucher_types_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE
            )
        `);

        // 8. Cost Centers
        await queryRunner.query(`
            CREATE TABLE "cost_centers" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "code" character varying NOT NULL,
                "name" character varying NOT NULL,
                "description" text,
                "is_active" boolean NOT NULL DEFAULT true,
                "parent_id" uuid,
                "company_id" uuid NOT NULL,
                "budget_amount" numeric(18,2) NOT NULL DEFAULT '0',
                "actual_amount" numeric(18,2) NOT NULL DEFAULT '0',
                CONSTRAINT "PK_cost_centers" PRIMARY KEY ("id"),
                CONSTRAINT "FK_cost_centers_parent" FOREIGN KEY ("parent_id") REFERENCES "cost_centers"("id"),
                CONSTRAINT "FK_cost_centers_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE
            )
        `);

        // 9. Projects
        await queryRunner.query(`
            CREATE TABLE "projects" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "project_code" character varying NOT NULL,
                "name" character varying NOT NULL,
                "description" text,
                "start_date" date,
                "end_date" date,
                "status" character varying NOT NULL DEFAULT 'NOT_STARTED',
                "budget_amount" numeric(18,2) NOT NULL DEFAULT '0',
                "actual_cost" numeric(18,2) NOT NULL DEFAULT '0',
                "estimated_revenue" numeric(18,2) NOT NULL DEFAULT '0',
                "actual_revenue" numeric(18,2) NOT NULL DEFAULT '0',
                "is_active" boolean NOT NULL DEFAULT true,
                "customer_id" uuid,
                "company_id" uuid NOT NULL,
                CONSTRAINT "PK_projects" PRIMARY KEY ("id"),
                CONSTRAINT "FK_projects_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE
            )
        `);

        // 10. Customers
        await queryRunner.query(`
            CREATE TABLE "customers" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying NOT NULL,
                "email" character varying,
                "phone" character varying,
                "address" text,
                "tax_id" character varying,
                "credit_limit" numeric(18,2) NOT NULL DEFAULT '0',
                "current_balance" numeric(18,2) NOT NULL DEFAULT '0',
                "is_active" boolean NOT NULL DEFAULT true,
                "company_id" uuid NOT NULL,
                CONSTRAINT "PK_customers" PRIMARY KEY ("id"),
                CONSTRAINT "FK_customers_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE
            )
        `);

        // 11. Suppliers
        await queryRunner.query(`
            CREATE TABLE "suppliers" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying NOT NULL,
                "email" character varying,
                "phone" character varying,
                "address" text,
                "tax_id" character varying,
                "payment_terms" character varying,
                "current_balance" numeric(18,2) NOT NULL DEFAULT '0',
                "is_active" boolean NOT NULL DEFAULT true,
                "company_id" uuid NOT NULL,
                CONSTRAINT "PK_suppliers" PRIMARY KEY ("id"),
                CONSTRAINT "FK_suppliers_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE
            )
        `);

        // 12. Items
        await queryRunner.query(`
            CREATE TABLE "items" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "item_code" character varying NOT NULL,
                "name" character varying NOT NULL,
                "description" text,
                "type" character varying NOT NULL,
                "category" character varying,
                "unit" character varying NOT NULL DEFAULT 'UNIT',
                "sales_price" numeric(18,2) NOT NULL DEFAULT '0',
                "purchase_price" numeric(18,2) NOT NULL DEFAULT '0',
                "is_inventory_item" boolean NOT NULL DEFAULT false,
                "current_stock" numeric(18,2) NOT NULL DEFAULT '0',
                "reorder_level" numeric(18,2) NOT NULL DEFAULT '0',
                "is_active" boolean NOT NULL DEFAULT true,
                "company_id" uuid NOT NULL,
                "sales_tax_category_id" uuid,
                "purchase_tax_category_id" uuid,
                "sales_account_id" uuid,
                "purchase_account_id" uuid,
                "inventory_account_id" uuid,
                CONSTRAINT "PK_items" PRIMARY KEY ("id"),
                CONSTRAINT "FK_items_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_items_sales_tax" FOREIGN KEY ("sales_tax_category_id") REFERENCES "tax_categories"("id") ON DELETE SET NULL,
                CONSTRAINT "FK_items_purchase_tax" FOREIGN KEY ("purchase_tax_category_id") REFERENCES "tax_categories"("id") ON DELETE SET NULL,
                CONSTRAINT "FK_items_sales_account" FOREIGN KEY ("sales_account_id") REFERENCES "accounts"("id") ON DELETE SET NULL,
                CONSTRAINT "FK_items_purchase_account" FOREIGN KEY ("purchase_account_id") REFERENCES "accounts"("id") ON DELETE SET NULL,
                CONSTRAINT "FK_items_inventory_account" FOREIGN KEY ("inventory_account_id") REFERENCES "accounts"("id") ON DELETE SET NULL
            )
        `);

        // 13. Journal Entries
        await queryRunner.query(`
            CREATE TABLE "journal_entries" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "entry_number" character varying NOT NULL,
                "date" date NOT NULL,
                "description" text,
                "reference" character varying,
                "status" character varying NOT NULL DEFAULT 'DRAFT',
                "total_amount" numeric(18,2) NOT NULL DEFAULT '0',
                "voucher_type_id" uuid,
                "company_id" uuid NOT NULL,
                "created_by" uuid,
                CONSTRAINT "PK_journal_entries" PRIMARY KEY ("id"),
                CONSTRAINT "FK_journal_entries_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_journal_entries_voucher_type" FOREIGN KEY ("voucher_type_id") REFERENCES "voucher_types"("id"),
                CONSTRAINT "FK_journal_entries_user" FOREIGN KEY ("created_by") REFERENCES "users"("id")
            )
        `);

        // 14. Journal Entry Lines
        await queryRunner.query(`
            CREATE TABLE "journal_entry_lines" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "description" text,
                "debit" numeric(18,2) NOT NULL DEFAULT '0',
                "credit" numeric(18,2) NOT NULL DEFAULT '0',
                "journal_entry_id" uuid NOT NULL,
                "account_id" uuid NOT NULL,
                "cost_center_id" uuid,
                "project_id" uuid,
                CONSTRAINT "PK_journal_entry_lines" PRIMARY KEY ("id"),
                CONSTRAINT "FK_journal_entry_lines_entry" FOREIGN KEY ("journal_entry_id") REFERENCES "journal_entries"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_journal_entry_lines_account" FOREIGN KEY ("account_id") REFERENCES "accounts"("id"),
                CONSTRAINT "FK_journal_entry_lines_cost_center" FOREIGN KEY ("cost_center_id") REFERENCES "cost_centers"("id"),
                CONSTRAINT "FK_journal_entry_lines_project" FOREIGN KEY ("project_id") REFERENCES "projects"("id")
            )
        `);

        // 15. Invoices
        await queryRunner.query(`
            CREATE TABLE "invoices" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "invoice_number" character varying NOT NULL,
                "reference_number" character varying,
                "invoice_date" date NOT NULL,
                "due_date" date NOT NULL,
                "description" text,
                "invoice_type" character varying NOT NULL,
                "status" character varying NOT NULL DEFAULT 'DRAFT',
                "subtotal" numeric(18,2) NOT NULL DEFAULT '0',
                "tax_amount" numeric(18,2) NOT NULL DEFAULT '0',
                "discount_amount" numeric(18,2) NOT NULL DEFAULT '0',
                "total_amount" numeric(18,2) NOT NULL DEFAULT '0',
                "paid_amount" numeric(18,2) NOT NULL DEFAULT '0',
                "balance_amount" numeric(18,2) NOT NULL DEFAULT '0',
                "discount_percentage" numeric(5,2) DEFAULT '0',
                "notes" text,
                "terms" text,
                "customer_id" uuid,
                "supplier_id" uuid,
                "company_id" uuid NOT NULL,
                "created_by" uuid,
                CONSTRAINT "PK_invoices" PRIMARY KEY ("id"),
                CONSTRAINT "FK_invoices_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_invoices_customer" FOREIGN KEY ("customer_id") REFERENCES "customers"("id"),
                CONSTRAINT "FK_invoices_supplier" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id"),
                CONSTRAINT "FK_invoices_user" FOREIGN KEY ("created_by") REFERENCES "users"("id")
            )
        `);

        // 16. Invoice Lines
        await queryRunner.query(`
            CREATE TABLE "invoice_lines" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "line_number" integer NOT NULL,
                "description" text,
                "quantity" numeric(18,2) NOT NULL DEFAULT '0',
                "unit_price" numeric(18,2) NOT NULL DEFAULT '0',
                "discount_percentage" numeric(5,2) DEFAULT '0',
                "discount_amount" numeric(18,2) NOT NULL DEFAULT '0',
                "tax_percentage" numeric(5,2) DEFAULT '0',
                "tax_amount" numeric(18,2) NOT NULL DEFAULT '0',
                "line_total" numeric(18,2) NOT NULL DEFAULT '0',
                "net_amount" numeric(18,2) NOT NULL DEFAULT '0',
                "invoice_id" uuid NOT NULL,
                "item_id" uuid,
                "account_id" uuid,
                "tax_category_id" uuid,
                CONSTRAINT "PK_invoice_lines" PRIMARY KEY ("id"),
                CONSTRAINT "FK_invoice_lines_invoice" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_invoice_lines_item" FOREIGN KEY ("item_id") REFERENCES "items"("id"),
                CONSTRAINT "FK_invoice_lines_account" FOREIGN KEY ("account_id") REFERENCES "accounts"("id"),
                CONSTRAINT "FK_invoice_lines_tax" FOREIGN KEY ("tax_category_id") REFERENCES "tax_categories"("id")
            )
        `);

        // 17. Reconciliations
        await queryRunner.query(`
            CREATE TABLE "reconciliations" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "statement_date" date NOT NULL,
                "statement_balance" numeric(18,2) NOT NULL DEFAULT '0',
                "book_balance" numeric(18,2) NOT NULL DEFAULT '0',
                "difference" numeric(18,2) GENERATED ALWAYS AS (statement_balance - book_balance) STORED,
                "is_reconciled" boolean NOT NULL DEFAULT false,
                "reconciled_at" TIMESTAMP,
                "account_id" uuid NOT NULL,
                "company_id" uuid NOT NULL,
                "reconciled_by" uuid,
                CONSTRAINT "PK_reconciliations" PRIMARY KEY ("id"),
                CONSTRAINT "FK_reconciliations_account" FOREIGN KEY ("account_id") REFERENCES "accounts"("id"),
                CONSTRAINT "FK_reconciliations_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_reconciliations_user" FOREIGN KEY ("reconciled_by") REFERENCES "users"("id")
            )
        `);

        // 18. Fixed Assets
        await queryRunner.query(`
            CREATE TABLE "fixed_assets" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying NOT NULL,
                "description" text NOT NULL,
                "purchase_date" date NOT NULL,
                "purchase_cost" numeric(18,2) NOT NULL,
                "salvage_value" numeric(18,2) NOT NULL,
                "useful_life_years" integer NOT NULL,
                "depreciation_method" character varying NOT NULL DEFAULT 'STRAIGHT_LINE',
                "status" character varying NOT NULL DEFAULT 'ACTIVE',
                "company_id" uuid NOT NULL,
                CONSTRAINT "PK_fixed_assets" PRIMARY KEY ("id"),
                CONSTRAINT "FK_fixed_assets_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE
            )
        `);

        // 19. Budgets
        await queryRunner.query(`
            CREATE TABLE "budgets" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "amount" numeric(18,2) NOT NULL,
                "period" character varying,
                "description" text,
                "account_id" uuid NOT NULL,
                "fiscal_year_id" uuid NOT NULL,
                "company_id" uuid NOT NULL,
                CONSTRAINT "PK_budgets" PRIMARY KEY ("id"),
                CONSTRAINT "FK_budgets_account" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_budgets_fiscal_year" FOREIGN KEY ("fiscal_year_id") REFERENCES "fiscal_years"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_budgets_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE
            )
        `);

        // 20. Account Balances
        await queryRunner.query(`
            CREATE TABLE "account_balances" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "period" character varying NOT NULL,
                "debit_amount" numeric(18,2) NOT NULL DEFAULT '0',
                "credit_amount" numeric(18,2) NOT NULL DEFAULT '0',
                "balance" numeric(18,2) NOT NULL DEFAULT '0',
                "account_id" uuid NOT NULL,
                "fiscal_year_id" uuid NOT NULL,
                "company_id" uuid NOT NULL,
                CONSTRAINT "PK_account_balances" PRIMARY KEY ("id"),
                CONSTRAINT "FK_account_balances_account" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_account_balances_fiscal_year" FOREIGN KEY ("fiscal_year_id") REFERENCES "fiscal_years"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_account_balances_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE
            )
        `);

        // Create Indexes
        await queryRunner.query(`CREATE INDEX "IDX_companies_name" ON "companies" ("name")`);
        await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users" ("email")`);
        await queryRunner.query(`CREATE INDEX "IDX_accounts_code" ON "accounts" ("code")`);
        await queryRunner.query(`CREATE INDEX "IDX_accounts_company" ON "accounts" ("company_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_items_code" ON "items" ("item_code")`);
        await queryRunner.query(`CREATE INDEX "IDX_items_company" ON "items" ("company_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_invoices_number" ON "invoices" ("invoice_number")`);
        await queryRunner.query(`CREATE INDEX "IDX_invoices_company" ON "invoices" ("company_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_journal_entries_number" ON "journal_entries" ("entry_number")`);
        await queryRunner.query(`CREATE INDEX "IDX_journal_entries_company" ON "journal_entries" ("company_id")`);

        // Deleted At Indexes
        await queryRunner.query(`CREATE INDEX "IDX_customers_deleted_at" ON "customers" ("deleted_at")`);
        await queryRunner.query(`CREATE INDEX "IDX_suppliers_deleted_at" ON "suppliers" ("deleted_at")`);
        await queryRunner.query(`CREATE INDEX "IDX_items_deleted_at" ON "items" ("deleted_at")`);
        await queryRunner.query(`CREATE INDEX "IDX_projects_deleted_at" ON "projects" ("deleted_at")`);
        await queryRunner.query(`CREATE INDEX "IDX_invoice_lines_deleted_at" ON "invoice_lines" ("deleted_at")`);
        await queryRunner.query(`CREATE INDEX "IDX_reconciliations_deleted_at" ON "reconciliations" ("deleted_at")`);
        await queryRunner.query(`CREATE INDEX "IDX_fixed_assets_deleted_at" ON "fixed_assets" ("deleted_at")`);
        await queryRunner.query(`CREATE INDEX "IDX_budgets_deleted_at" ON "budgets" ("deleted_at")`);
        await queryRunner.query(`CREATE INDEX "IDX_cost_centers_deleted_at" ON "cost_centers" ("deleted_at")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "account_balances" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "budgets" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "fixed_assets" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "reconciliations" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "invoice_lines" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "invoices" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "journal_entry_lines" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "journal_entries" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "items" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "suppliers" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "customers" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "projects" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "cost_centers" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "voucher_types" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "accounts" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "tax_categories" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "fiscal_years" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "user_companies" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "companies" CASCADE`);
    }
}
