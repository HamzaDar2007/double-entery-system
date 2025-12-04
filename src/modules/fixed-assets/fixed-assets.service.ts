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
  ) { }

  async create(assetData: Partial<FixedAsset>, companyId: string): Promise<FixedAsset> {
    const asset = this.fixedAssetsRepository.create({
      ...assetData,
      companyId,
    });
    return this.fixedAssetsRepository.save(asset);
  }

  async findAll(companyId: string): Promise<FixedAsset[]> {
    // Return empty array if no company is assigned
    if (!companyId) {
      return [];
    }
    return this.fixedAssetsRepository.find({
      where: { companyId },
    });
  }

  async calculateDepreciation(assetId: string) {
    // Logic to calculate depreciation schedule
    return { message: 'Depreciation calculation triggered' };
  }
}
