import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalancesService } from './balances.service';
import { AccountBalance } from './entities/account-balance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountBalance])],
  providers: [BalancesService],
  exports: [BalancesService],
})
export class BalancesModule {}
