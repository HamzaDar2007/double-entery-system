import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaxCategory, TaxType } from './entities/tax-category.entity';
import { CreateTaxCategoryDto } from './dto/create-tax-category.dto';
import { UpdateTaxCategoryDto } from './dto/update-tax-category.dto';

@Injectable()
export class TaxCategoriesService {
  constructor(
    @InjectRepository(TaxCategory)
    private readonly taxCategoryRepository: Repository<TaxCategory>,
  ) { }

  async create(
    createTaxCategoryDto: CreateTaxCategoryDto,
    companyId: string,
  ): Promise<TaxCategory> {
    const existing = await this.taxCategoryRepository.findOne({
      where: { code: createTaxCategoryDto.code, companyId },
    });

    if (existing) {
      throw new ConflictException('Tax category code already exists');
    }

    const taxCategory = this.taxCategoryRepository.create({
      ...createTaxCategoryDto,
      companyId,
      rate: createTaxCategoryDto.rate.toString(),
    });

    return this.taxCategoryRepository.save(taxCategory);
  }

  async findAll(
    companyId: string,
    type?: TaxType,
    isActive?: boolean,
  ): Promise<TaxCategory[]> {
    if (!companyId) {
      return [];
    }

    const query = this.taxCategoryRepository
      .createQueryBuilder('tax_category')
      .where('tax_category.company_id = :companyId', { companyId });

    if (type) {
      query.andWhere('tax_category.type = :type', { type });
    }

    if (isActive !== undefined) {
      query.andWhere('tax_category.is_active = :isActive', { isActive });
    }

    return query.orderBy('tax_category.name', 'ASC').getMany();
  }

  async findOne(id: string, companyId: string): Promise<TaxCategory> {
    const taxCategory = await this.taxCategoryRepository.findOne({
      where: { id, companyId },
    });

    if (!taxCategory) {
      throw new NotFoundException(`Tax category with ID ${id} not found`);
    }

    return taxCategory;
  }

  async update(
    id: string,
    updateTaxCategoryDto: UpdateTaxCategoryDto,
    companyId: string,
  ): Promise<TaxCategory> {
    const taxCategory = await this.findOne(id, companyId);

    if (
      updateTaxCategoryDto.code &&
      updateTaxCategoryDto.code !== taxCategory.code
    ) {
      const existing = await this.taxCategoryRepository.findOne({
        where: { code: updateTaxCategoryDto.code, companyId },
      });

      if (existing) {
        throw new ConflictException('Tax category code already exists');
      }
    }

    Object.assign(taxCategory, {
      ...updateTaxCategoryDto,
      rate: updateTaxCategoryDto.rate?.toString() || taxCategory.rate,
    });

    return this.taxCategoryRepository.save(taxCategory);
  }

  async remove(id: string, companyId: string): Promise<void> {
    const taxCategory = await this.findOne(id, companyId);
    await this.taxCategoryRepository.softDelete(id);
  }
}
