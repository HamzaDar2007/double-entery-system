import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reconciliation } from './entities/reconciliation.entity';
import { CreateReconciliationDto } from './dto/create-reconciliation.dto';

@Injectable()
export class ReconciliationsService {
  constructor(
    @InjectRepository(Reconciliation)
    private reconciliationsRepository: Repository<Reconciliation>,
  ) { }

  async create(createReconciliationDto: CreateReconciliationDto, companyId: string): Promise<Reconciliation> {
    const reconciliation = this.reconciliationsRepository.create({
      ...createReconciliationDto,
      companyId,
    });
    return this.reconciliationsRepository.save(reconciliation);
  }

  async findAll(companyId: string): Promise<Reconciliation[]> {
    // Return empty array if no company is assigned
    if (!companyId) {
      return [];
    }
    return this.reconciliationsRepository.find({
      where: { companyId },
    });
  }

  async findOne(id: string, companyId: string): Promise<Reconciliation> {
    const reconciliation = await this.reconciliationsRepository.findOne({
      where: { id, companyId }
    });
    if (!reconciliation) {
      throw new NotFoundException(`Reconciliation with ID ${id} not found`);
    }
    return reconciliation;
  }
}
