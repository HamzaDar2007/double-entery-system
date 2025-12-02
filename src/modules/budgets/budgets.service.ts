import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private budgetsRepository: Repository<Budget>,
  ) {}

  async create(budgetData: Partial<Budget>): Promise<Budget> {
    const budget = this.budgetsRepository.create(budgetData);
    return this.budgetsRepository.save(budget);
  }

  async findAll(): Promise<Budget[]> {
    return this.budgetsRepository.find();
  }

  async findByAccount(accountId: string, fiscalYearId: string): Promise<Budget[]> {
    return this.budgetsRepository.find({
      where: { accountId, fiscalYearId },
    });
  }
}
