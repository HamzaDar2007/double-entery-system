import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FixedAsset } from './entities/fixed-asset.entity';
import { DepreciationSchedule } from './entities/depreciation-schedule.entity';

@Injectable()
export class FixedAssetsService {
  constructor(
    @InjectRepository(FixedAsset)
    private fixedAssetsRepository: Repository<FixedAsset>,
    @InjectRepository(DepreciationSchedule)
    private depreciationScheduleRepository: Repository<DepreciationSchedule>,
  ) {}

  async create(assetData: Partial<FixedAsset>): Promise<FixedAsset> {
    const asset = this.fixedAssetsRepository.create(assetData);
    return this.fixedAssetsRepository.save(asset);
  }

  async findAll(): Promise<FixedAsset[]> {
    return this.fixedAssetsRepository.find();
  }

  async calculateDepreciation(assetId: string) {
    // Logic to calculate depreciation schedule
    return { message: 'Depreciation calculation triggered' };
  }
}
