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
import { TaxCategoriesService } from './tax-categories.service';
import { CreateTaxCategoryDto } from './dto/create-tax-category.dto';
import { UpdateTaxCategoryDto } from './dto/update-tax-category.dto';
import { TaxType } from './entities/tax-category.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentCompany } from '../../common/decorators/current-company.decorator';

@Controller('tax-categories')
@UseGuards(JwtAuthGuard)
export class TaxCategoriesController {
  constructor(private readonly taxCategoriesService: TaxCategoriesService) {}

  @Post()
  create(
    @Body() createTaxCategoryDto: CreateTaxCategoryDto,
    @CurrentCompany() companyId: string,
  ) {
    return this.taxCategoriesService.create(createTaxCategoryDto, companyId);
  }

  @Get()
  findAll(
    @CurrentCompany() companyId: string,
    @Query('type') type?: TaxType,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.taxCategoriesService.findAll(companyId, type, isActive);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentCompany() companyId: string) {
    return this.taxCategoriesService.findOne(id, companyId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaxCategoryDto: UpdateTaxCategoryDto,
    @CurrentCompany() companyId: string,
  ) {
    return this.taxCategoriesService.update(id, updateTaxCategoryDto, companyId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentCompany() companyId: string) {
    await this.taxCategoriesService.remove(id, companyId);
    return { message: 'Tax category deleted successfully' };
  }
}
