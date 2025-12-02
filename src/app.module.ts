import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import redisConfig from './config/redis.config';
import queueConfig from './config/queue.config';
import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { FiscalYearsModule } from './modules/fiscal-years/fiscal-years.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { VouchersModule } from './modules/vouchers/vouchers.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { ItemsModule } from './modules/items/items.module';
import { CustomersModule } from './modules/customers/customers.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { TaxCategoriesModule } from './modules/tax-categories/tax-categories.module';
import { CostCentersModule } from './modules/cost-centers/cost-centers.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ReportsModule } from './modules/reports/reports.module';
import { JobsModule } from './jobs/jobs.module';
import { UsersModule } from './modules/users/users.module';
import { ReconciliationsModule } from './modules/reconciliations/reconciliations.module';
import { BalancesModule } from './modules/balances/balances.module';
import { CurrenciesModule } from './modules/currencies/currencies.module';
import { FixedAssetsModule } from './modules/fixed-assets/fixed-assets.module';
import { BudgetsModule } from './modules/budgets/budgets.module';
import { dataSourceOptions } from '../typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig, redisConfig, queueConfig],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    AuthModule,
    CompaniesModule,
    FiscalYearsModule,
    AccountsModule,
    VouchersModule,
    InvoicesModule,
    ItemsModule,
    CustomersModule,
    SuppliersModule,
    TaxCategoriesModule,
    CostCentersModule,
    ProjectsModule,
    ReportsModule,
    JobsModule,
    UsersModule,
    ReconciliationsModule,
    BalancesModule,
    CurrenciesModule,
    FixedAssetsModule,
    BudgetsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
