import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Item } from './entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) { }

  async create(createItemDto: CreateItemDto, companyId: string): Promise<Item> {
    // Check if item code already exists
    const existing = await this.itemRepository.findOne({
      where: { itemCode: createItemDto.itemCode, companyId },
    });

    if (existing) {
      throw new ConflictException('Item code already exists');
    }

    const item = this.itemRepository.create({
      ...createItemDto,
      companyId,
      salesPrice: createItemDto.salesPrice?.toString() || '0',
      purchasePrice: createItemDto.purchasePrice?.toString() || '0',
      currentStock: createItemDto.currentStock?.toString() || '0',
      reorderLevel: createItemDto.reorderLevel?.toString() || '0',
    });

    return this.itemRepository.save(item);
  }

  async findAll(
    companyId: string,
    search?: string,
    category?: string,
    isActive?: boolean,
  ): Promise<Item[]> {
    // Return empty array if no company is assigned
    if (!companyId) {
      return [];
    }

    const query = this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.salesTaxCategory', 'salesTaxCategory')
      .leftJoinAndSelect('item.purchaseTaxCategory', 'purchaseTaxCategory')
      .leftJoinAndSelect('item.salesAccount', 'salesAccount')
      .leftJoinAndSelect('item.purchaseAccount', 'purchaseAccount')
      .where('item.company_id = :companyId', { companyId });

    if (search) {
      query.andWhere(
        '(item.name ILIKE :search OR item.item_code ILIKE :search OR item.barcode ILIKE :search OR item.sku ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category) {
      query.andWhere('item.category = :category', { category });
    }

    if (isActive !== undefined) {
      query.andWhere('item.is_active = :isActive', { isActive });
    }

    return query.orderBy('item.name', 'ASC').getMany();
  }

  async findOne(id: string, companyId: string): Promise<Item> {
    const item = await this.itemRepository.findOne({
      where: { id, companyId },
      relations: [
        'salesTaxCategory',
        'purchaseTaxCategory',
        'salesAccount',
        'purchaseAccount',
        'inventoryAccount',
      ],
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    return item;
  }

  async findByCode(itemCode: string, companyId: string): Promise<Item> {
    const item = await this.itemRepository.findOne({
      where: { itemCode, companyId },
    });

    if (!item) {
      throw new NotFoundException(`Item with code ${itemCode} not found`);
    }

    return item;
  }

  async update(
    id: string,
    updateItemDto: UpdateItemDto,
    companyId: string,
  ): Promise<Item> {
    const item = await this.findOne(id, companyId);

    // Check if new item code conflicts
    if (updateItemDto.itemCode && updateItemDto.itemCode !== item.itemCode) {
      const existing = await this.itemRepository.findOne({
        where: { itemCode: updateItemDto.itemCode, companyId },
      });

      if (existing) {
        throw new ConflictException('Item code already exists');
      }
    }

    Object.assign(item, {
      ...updateItemDto,
      salesPrice: updateItemDto.salesPrice?.toString() || item.salesPrice,
      purchasePrice: updateItemDto.purchasePrice?.toString() || item.purchasePrice,
      currentStock: updateItemDto.currentStock?.toString() || item.currentStock,
      reorderLevel: updateItemDto.reorderLevel?.toString() || item.reorderLevel,
    });

    return this.itemRepository.save(item);
  }

  async remove(id: string, companyId: string): Promise<void> {
    const item = await this.findOne(id, companyId);
    await this.itemRepository.softDelete(id);
  }

  async updateStock(
    id: string,
    quantity: number,
    companyId: string,
  ): Promise<Item> {
    const item = await this.findOne(id, companyId);

    if (!item.isInventoryItem) {
      throw new ConflictException('Item is not an inventory item');
    }

    const currentStock = parseFloat(item.currentStock);
    const newStock = currentStock + quantity;

    if (newStock < 0) {
      throw new ConflictException('Insufficient stock');
    }

    item.currentStock = newStock.toString();
    return this.itemRepository.save(item);
  }

  async getLowStockItems(companyId: string): Promise<Item[]> {
    // Return empty array if no company is assigned
    if (!companyId) {
      return [];
    }

    return this.itemRepository
      .createQueryBuilder('item')
      .where('item.company_id = :companyId', { companyId })
      .andWhere('item.is_inventory_item = true')
      .andWhere('item.is_active = true')
      .andWhere('CAST(item.current_stock AS DECIMAL) <= CAST(item.reorder_level AS DECIMAL)')
      .orderBy('item.name', 'ASC')
      .getMany();
  }
}
