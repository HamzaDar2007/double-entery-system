import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private budgetsRepository: Repository<Budget>,
  ) { }

  async create(budgetData: Partial<Budget>, companyId: string): Promise<Budget> {
    const budget = this.budgetsRepository.create({
      ...budgetData,
      companyId,
    });
    return this.budgetsRepository.save(budget);
  }

  async findAll(companyId: string): Promise<Budget[]> {
    // Return empty array if no company is assigned
    if (!companyId) {
      return [];
    }
    return this.budgetsRepository.find({
      where: { companyId },
    });
  }

  async findByAccount(accountId: string, fiscalYearId: string, companyId: string): Promise<Budget[]> {
    // Return empty array if no company is assigned
    if (!companyId) {
      return [];
    }
    return this.budgetsRepository.find({
      where: { accountId, fiscalYearId, companyId },
    });
  }
}
