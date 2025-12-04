import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { FixedAssetsService } from './fixed-assets.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentCompany } from '../../common/decorators/current-company.decorator';

@Controller('fixed-assets')
@UseGuards(JwtAuthGuard)
export class FixedAssetsController {
  constructor(private readonly fixedAssetsService: FixedAssetsService) { }

  @Post()
  create(@Body() body: any, @CurrentCompany() companyId: string) {
    return this.fixedAssetsService.create(body, companyId);
  }

  @Get()
  findAll(@CurrentCompany() companyId: string) {
    return this.fixedAssetsService.findAll(companyId);
  }

  @Post(':id/depreciate')
  calculateDepreciation(@Param('id') id: string) {
    return this.fixedAssetsService.calculateDepreciation(id);
  }
}
