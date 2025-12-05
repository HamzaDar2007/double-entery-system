import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { Account } from './entities/account.entity';
import { AccountBalanceRollupService } from './services/account-balance-rollup.service';

@Module({
    imports: [TypeOrmModule.forFeature([Account])],
    controllers: [AccountsController],
    providers: [AccountsService, AccountBalanceRollupService],
    exports: [AccountsService, AccountBalanceRollupService],
})
export class AccountsModule { }
