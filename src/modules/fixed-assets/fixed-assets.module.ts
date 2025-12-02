import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FixedAssetsService } from './fixed-assets.service';
import { FixedAssetsController } from './fixed-assets.controller';
import { FixedAsset } from './entities/fixed-asset.entity';
import { DepreciationSchedule } from './entities/depreciation-schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FixedAsset, DepreciationSchedule])],
  controllers: [FixedAssetsController],
  providers: [FixedAssetsService],
  exports: [FixedAssetsService],
})
export class FixedAssetsModule {}
