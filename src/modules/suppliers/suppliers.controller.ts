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
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentCompany } from '../../common/decorators/current-company.decorator';

@Controller('suppliers')
@UseGuards(JwtAuthGuard)
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  create(
    @Body() createSupplierDto: CreateSupplierDto,
    @CurrentCompany() companyId: string,
  ) {
    return this.suppliersService.create(createSupplierDto, companyId);
  }

  @Get()
  findAll(
    @CurrentCompany() companyId: string,
    @Query('search') search?: string,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.suppliersService.findAll(companyId, search, isActive);
  }

  @Get('with-balance')
  getSuppliersWithBalance(@CurrentCompany() companyId: string) {
    return this.suppliersService.getSuppliersWithBalance(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentCompany() companyId: string) {
    return this.suppliersService.findOne(id, companyId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
    @CurrentCompany() companyId: string,
  ) {
    return this.suppliersService.update(id, updateSupplierDto, companyId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentCompany() companyId: string) {
    await this.suppliersService.remove(id, companyId);
    return { message: 'Supplier deleted successfully' };
  }
}
