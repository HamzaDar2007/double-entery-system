import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentCompany } from '../../common/decorators/current-company.decorator';

@Controller('items')
@UseGuards(JwtAuthGuard)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  create(
    @Body() createItemDto: CreateItemDto,
    @CurrentCompany() companyId: string,
  ) {
    return this.itemsService.create(createItemDto, companyId);
  }

  @Get()
  findAll(
    @CurrentCompany() companyId: string,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.itemsService.findAll(companyId, search, category, isActive);
  }

  @Get('low-stock')
  getLowStockItems(@CurrentCompany() companyId: string) {
    return this.itemsService.getLowStockItems(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentCompany() companyId: string) {
    return this.itemsService.findOne(id, companyId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
    @CurrentCompany() companyId: string,
  ) {
    return this.itemsService.update(id, updateItemDto, companyId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentCompany() companyId: string) {
    await this.itemsService.remove(id, companyId);
    return { message: 'Item deleted successfully' };
  }

  @Patch(':id/stock')
  updateStock(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
    @CurrentCompany() companyId: string,
  ) {
    return this.itemsService.updateStock(id, quantity, companyId);
  }
}
