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
import { CostCentersService } from './cost-centers.service';
import { CreateCostCenterDto } from './dto/create-cost-center.dto';
import { UpdateCostCenterDto } from './dto/update-cost-center.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentCompany } from '../../common/decorators/current-company.decorator';

@Controller('cost-centers')
@UseGuards(JwtAuthGuard)
export class CostCentersController {
  constructor(private readonly costCentersService: CostCentersService) {}

  @Post()
  create(
    @Body() createCostCenterDto: CreateCostCenterDto,
    @CurrentCompany() companyId: string,
  ) {
    return this.costCentersService.create(createCostCenterDto, companyId);
  }

  @Get()
  findAll(
    @CurrentCompany() companyId: string,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.costCentersService.findAll(companyId, isActive);
  }

  @Get('tree')
  findTree(@CurrentCompany() companyId: string) {
    return this.costCentersService.findTree(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentCompany() companyId: string) {
    return this.costCentersService.findOne(id, companyId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCostCenterDto: UpdateCostCenterDto,
    @CurrentCompany() companyId: string,
  ) {
    return this.costCentersService.update(id, updateCostCenterDto, companyId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentCompany() companyId: string) {
    await this.costCentersService.remove(id, companyId);
    return { message: 'Cost center deleted successfully' };
  }
}
