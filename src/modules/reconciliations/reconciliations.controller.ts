import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ReconciliationsService } from './reconciliations.service';
import { CreateReconciliationDto } from './dto/create-reconciliation.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('reconciliations')
@UseGuards(JwtAuthGuard)
export class ReconciliationsController {
  constructor(private readonly reconciliationsService: ReconciliationsService) {}

  @Post()
  create(@Body() createReconciliationDto: CreateReconciliationDto) {
    return this.reconciliationsService.create(createReconciliationDto);
  }

  @Get()
  findAll() {
    return this.reconciliationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reconciliationsService.findOne(id);
  }
}
