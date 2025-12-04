import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ReconciliationsService } from './reconciliations.service';
import { CreateReconciliationDto } from './dto/create-reconciliation.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentCompany } from '../../common/decorators/current-company.decorator';

@Controller('reconciliations')
@UseGuards(JwtAuthGuard)
export class ReconciliationsController {
  constructor(private readonly reconciliationsService: ReconciliationsService) { }

  @Post()
  create(@Body() createReconciliationDto: CreateReconciliationDto, @CurrentCompany() companyId: string) {
    return this.reconciliationsService.create(createReconciliationDto, companyId);
  }

  @Get()
  findAll(@CurrentCompany() companyId: string) {
    return this.reconciliationsService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentCompany() companyId: string) {
    return this.reconciliationsService.findOne(id, companyId);
  }
}
