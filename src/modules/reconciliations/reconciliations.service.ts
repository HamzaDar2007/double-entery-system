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
  ) {}

  async create(createReconciliationDto: CreateReconciliationDto): Promise<Reconciliation> {
    const reconciliation = this.reconciliationsRepository.create(createReconciliationDto);
    return this.reconciliationsRepository.save(reconciliation);
  }

  async findAll(): Promise<Reconciliation[]> {
    return this.reconciliationsRepository.find();
  }

  async findOne(id: string): Promise<Reconciliation> {
    const reconciliation = await this.reconciliationsRepository.findOne({ where: { id } });
    if (!reconciliation) {
      throw new NotFoundException(`Reconciliation with ID ${id} not found`);
    }
    return reconciliation;
  }
}
