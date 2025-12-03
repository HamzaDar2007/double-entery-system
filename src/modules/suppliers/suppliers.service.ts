import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import Decimal from 'decimal.js';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) { }

  async create(
    createSupplierDto: CreateSupplierDto,
    companyId: string,
  ): Promise<Supplier> {
    const existing = await this.supplierRepository.findOne({
      where: { supplierCode: createSupplierDto.supplierCode, companyId },
    });

    if (existing) {
      throw new ConflictException('Supplier code already exists');
    }

    const supplier = this.supplierRepository.create({
      ...createSupplierDto,
      companyId,
      currentBalance: '0',
    });

    return this.supplierRepository.save(supplier);
  }

  async findAll(
    companyId: string,
    search?: string,
    isActive?: boolean,
  ): Promise<Supplier[]> {
    // Return empty array if no company is assigned
    if (!companyId) {
      return [];
    }

    const query = this.supplierRepository
      .createQueryBuilder('supplier')
      .where('supplier.company_id = :companyId', { companyId });

    if (search) {
      query.andWhere(
        '(supplier.name ILIKE :search OR supplier.supplier_code ILIKE :search OR supplier.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (isActive !== undefined) {
      query.andWhere('supplier.is_active = :isActive', { isActive });
    }

    return query.orderBy('supplier.name', 'ASC').getMany();
  }

  async findOne(id: string, companyId: string): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({
      where: { id, companyId },
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    return supplier;
  }

  async update(
    id: string,
    updateSupplierDto: UpdateSupplierDto,
    companyId: string,
  ): Promise<Supplier> {
    const supplier = await this.findOne(id, companyId);

    if (
      updateSupplierDto.supplierCode &&
      updateSupplierDto.supplierCode !== supplier.supplierCode
    ) {
      const existing = await this.supplierRepository.findOne({
        where: { supplierCode: updateSupplierDto.supplierCode, companyId },
      });

      if (existing) {
        throw new ConflictException('Supplier code already exists');
      }
    }

    Object.assign(supplier, updateSupplierDto);
    return this.supplierRepository.save(supplier);
  }

  async remove(id: string, companyId: string): Promise<void> {
    const supplier = await this.findOne(id, companyId);
    await this.supplierRepository.softDelete(id);
  }

  async updateBalance(
    id: string,
    amount: number,
    companyId: string,
  ): Promise<Supplier> {
    const supplier = await this.findOne(id, companyId);
    const currentBalance = new Decimal(supplier.currentBalance);
    const newBalance = currentBalance.plus(amount);
    supplier.currentBalance = newBalance.toString();
    return this.supplierRepository.save(supplier);
  }

  async getSuppliersWithBalance(companyId: string): Promise<Supplier[]> {
    // Return empty array if no company is assigned
    if (!companyId) {
      return [];
    }

    return this.supplierRepository
      .createQueryBuilder('supplier')
      .where('supplier.company_id = :companyId', { companyId })
      .andWhere('supplier.is_active = true')
      .andWhere("CAST(supplier.current_balance AS DECIMAL) != 0")
      .orderBy('supplier.name', 'ASC')
      .getMany();
  }
}
