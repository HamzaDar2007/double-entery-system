import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReconciliationsService } from './reconciliations.service';
import { ReconciliationsController } from './reconciliations.controller';
import { Reconciliation } from './entities/reconciliation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reconciliation])],
  controllers: [ReconciliationsController],
  providers: [ReconciliationsService],
  exports: [ReconciliationsService],
})
export class ReconciliationsModule {}
