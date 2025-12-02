import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import Decimal from 'decimal.js';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(
    createCustomerDto: CreateCustomerDto,
    companyId: string,
  ): Promise<Customer> {
    const existing = await this.customerRepository.findOne({
      where: { customerCode: createCustomerDto.customerCode, companyId },
    });

    if (existing) {
      throw new ConflictException('Customer code already exists');
    }

    const customer = this.customerRepository.create({
      ...createCustomerDto,
      companyId,
      creditLimit: createCustomerDto.creditLimit?.toString() || '0',
      currentBalance: '0',
    });

    return this.customerRepository.save(customer);
  }

  async findAll(
    companyId: string,
    search?: string,
    isActive?: boolean,
  ): Promise<Customer[]> {
    const query = this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.company_id = :companyId', { companyId });

    if (search) {
      query.andWhere(
        '(customer.name ILIKE :search OR customer.customer_code ILIKE :search OR customer.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (isActive !== undefined) {
      query.andWhere('customer.is_active = :isActive', { isActive });
    }

    return query.orderBy('customer.name', 'ASC').getMany();
  }

  async findOne(id: string, companyId: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id, companyId },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
    companyId: string,
  ): Promise<Customer> {
    const customer = await this.findOne(id, companyId);

    if (
      updateCustomerDto.customerCode &&
      updateCustomerDto.customerCode !== customer.customerCode
    ) {
      const existing = await this.customerRepository.findOne({
        where: { customerCode: updateCustomerDto.customerCode, companyId },
      });

      if (existing) {
        throw new ConflictException('Customer code already exists');
      }
    }

    Object.assign(customer, {
      ...updateCustomerDto,
      creditLimit: updateCustomerDto.creditLimit?.toString() || customer.creditLimit,
    });

    return this.customerRepository.save(customer);
  }

  async remove(id: string, companyId: string): Promise<void> {
    const customer = await this.findOne(id, companyId);
    await this.customerRepository.softDelete(id);
  }

  async updateBalance(
    id: string,
    amount: number,
    companyId: string,
  ): Promise<Customer> {
    const customer = await this.findOne(id, companyId);
    const currentBalance = new Decimal(customer.currentBalance);
    const newBalance = currentBalance.plus(amount);
    customer.currentBalance = newBalance.toString();
    return this.customerRepository.save(customer);
  }

  async getCustomersWithBalance(companyId: string): Promise<Customer[]> {
    return this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.company_id = :companyId', { companyId })
      .andWhere('customer.is_active = true')
      .andWhere("CAST(customer.current_balance AS DECIMAL) != 0")
      .orderBy('customer.name', 'ASC')
      .getMany();
  }
}
