import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import Decimal from 'decimal.js';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) { }

  async create(
    createProjectDto: CreateProjectDto,
    companyId: string,
  ): Promise<Project> {
    const existing = await this.projectRepository.findOne({
      where: { projectCode: createProjectDto.projectCode, companyId },
    });

    if (existing) {
      throw new ConflictException('Project code already exists');
    }

    const project = this.projectRepository.create({
      ...createProjectDto,
      companyId,
      budgetAmount: createProjectDto.budgetAmount?.toString() || '0',
      estimatedRevenue: createProjectDto.estimatedRevenue?.toString() || '0',
      actualCost: '0',
      actualRevenue: '0',
    });

    return this.projectRepository.save(project);
  }

  async findAll(
    companyId: string,
    status?: ProjectStatus,
    isActive?: boolean,
  ): Promise<Project[]> {
    // Return empty array if no company is assigned
    if (!companyId) {
      return [];
    }

    const query = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.customer', 'customer')
      .where('project.company_id = :companyId', { companyId });

    if (status) {
      query.andWhere('project.status = :status', { status });
    }

    if (isActive !== undefined) {
      query.andWhere('project.is_active = :isActive', { isActive });
    }

    return query.orderBy('project.name', 'ASC').getMany();
  }

  async findOne(id: string, companyId: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id, companyId },
      relations: ['customer'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    companyId: string,
  ): Promise<Project> {
    const project = await this.findOne(id, companyId);

    if (
      updateProjectDto.projectCode &&
      updateProjectDto.projectCode !== project.projectCode
    ) {
      const existing = await this.projectRepository.findOne({
        where: { projectCode: updateProjectDto.projectCode, companyId },
      });

      if (existing) {
        throw new ConflictException('Project code already exists');
      }
    }

    Object.assign(project, {
      ...updateProjectDto,
      budgetAmount: updateProjectDto.budgetAmount?.toString() || project.budgetAmount,
      estimatedRevenue: updateProjectDto.estimatedRevenue?.toString() || project.estimatedRevenue,
    });

    return this.projectRepository.save(project);
  }

  async remove(id: string, companyId: string): Promise<void> {
    const project = await this.findOne(id, companyId);
    await this.projectRepository.softDelete(id);
  }

  async updateCost(
    id: string,
    amount: number,
    companyId: string,
  ): Promise<Project> {
    const project = await this.findOne(id, companyId);
    const actualCost = new Decimal(project.actualCost);
    const newCost = actualCost.plus(amount);
    project.actualCost = newCost.toString();
    return this.projectRepository.save(project);
  }

  async updateRevenue(
    id: string,
    amount: number,
    companyId: string,
  ): Promise<Project> {
    const project = await this.findOne(id, companyId);
    const actualRevenue = new Decimal(project.actualRevenue);
    const newRevenue = actualRevenue.plus(amount);
    project.actualRevenue = newRevenue.toString();
    return this.projectRepository.save(project);
  }

  async getProjectVariance(id: string, companyId: string) {
    const project = await this.findOne(id, companyId);

    const budgetAmount = new Decimal(project.budgetAmount);
    const actualCost = new Decimal(project.actualCost);
    const costVariance = budgetAmount.minus(actualCost);
    const costVariancePercentage = budgetAmount.isZero()
      ? new Decimal(0)
      : costVariance.dividedBy(budgetAmount).times(100);

    const estimatedRevenue = new Decimal(project.estimatedRevenue);
    const actualRevenue = new Decimal(project.actualRevenue);
    const revenueVariance = actualRevenue.minus(estimatedRevenue);
    const revenueVariancePercentage = estimatedRevenue.isZero()
      ? new Decimal(0)
      : revenueVariance.dividedBy(estimatedRevenue).times(100);

    return {
      project,
      budgetAmount: budgetAmount.toString(),
      actualCost: actualCost.toString(),
      costVariance: costVariance.toString(),
      costVariancePercentage: costVariancePercentage.toFixed(2),
      estimatedRevenue: estimatedRevenue.toString(),
      actualRevenue: actualRevenue.toString(),
      revenueVariance: revenueVariance.toString(),
      revenueVariancePercentage: revenueVariancePercentage.toFixed(2),
    };
  }
}
