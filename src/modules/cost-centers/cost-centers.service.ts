import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { CostCenter } from './entities/cost-center.entity';
import { CreateCostCenterDto } from './dto/create-cost-center.dto';
import { UpdateCostCenterDto } from './dto/update-cost-center.dto';

@Injectable()
export class CostCentersService {
  constructor(
    @InjectRepository(CostCenter)
    private readonly costCenterRepository: TreeRepository<CostCenter>,
  ) { }

  async create(
    createCostCenterDto: CreateCostCenterDto,
    companyId: string,
  ): Promise<CostCenter> {
    const existing = await this.costCenterRepository.findOne({
      where: { code: createCostCenterDto.code, companyId },
    });

    if (existing) {
      throw new ConflictException('Cost center code already exists');
    }

    let parent: CostCenter | undefined = undefined;
    if (createCostCenterDto.parentId) {
      parent = await this.findOne(createCostCenterDto.parentId, companyId);
    }

    const costCenter = this.costCenterRepository.create({
      ...createCostCenterDto,
      companyId,
      budgetAmount: createCostCenterDto.budgetAmount?.toString() || '0',
      actualAmount: '0',
      parent,
    });

    return this.costCenterRepository.save(costCenter);
  }

  async findAll(companyId: string, isActive?: boolean): Promise<CostCenter[]> {
    // Return empty array if no company is assigned
    if (!companyId) {
      return [];
    }

    const query = this.costCenterRepository
      .createQueryBuilder('cost_center')
      .where('cost_center.company_id = :companyId', { companyId });

    if (isActive !== undefined) {
      query.andWhere('cost_center.is_active = :isActive', { isActive });
    }

    return query.orderBy('cost_center.code', 'ASC').getMany();
  }

  async findTree(companyId: string): Promise<CostCenter[]> {
    // Return empty array if no company is assigned
    if (!companyId) {
      return [];
    }

    const roots = await this.costCenterRepository.find({
      where: { companyId, parent: null as any },
    });

    const trees: CostCenter[] = [];
    for (const root of roots) {
      const tree = await this.costCenterRepository.findDescendantsTree(root);
      trees.push(tree);
    }

    return trees;
  }

  async findOne(id: string, companyId: string): Promise<CostCenter> {
    const costCenter = await this.costCenterRepository.findOne({
      where: { id, companyId },
      relations: ['parent', 'children'],
    });

    if (!costCenter) {
      throw new NotFoundException(`Cost center with ID ${id} not found`);
    }

    return costCenter;
  }

  async update(
    id: string,
    updateCostCenterDto: UpdateCostCenterDto,
    companyId: string,
  ): Promise<CostCenter> {
    const costCenter = await this.findOne(id, companyId);

    if (
      updateCostCenterDto.code &&
      updateCostCenterDto.code !== costCenter.code
    ) {
      const existing = await this.costCenterRepository.findOne({
        where: { code: updateCostCenterDto.code, companyId },
      });

      if (existing) {
        throw new ConflictException('Cost center code already exists');
      }
    }

    if (updateCostCenterDto.parentId) {
      const parent = await this.findOne(updateCostCenterDto.parentId, companyId);
      costCenter.parent = parent;
    }

    Object.assign(costCenter, {
      ...updateCostCenterDto,
      budgetAmount: updateCostCenterDto.budgetAmount?.toString() || costCenter.budgetAmount,
    });

    return this.costCenterRepository.save(costCenter);
  }

  async remove(id: string, companyId: string): Promise<void> {
    const costCenter = await this.findOne(id, companyId);
    await this.costCenterRepository.softDelete(id);
  }
}
