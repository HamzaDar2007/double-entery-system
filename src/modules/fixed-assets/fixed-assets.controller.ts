import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { FixedAssetsService } from './fixed-assets.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('fixed-assets')
@UseGuards(JwtAuthGuard)
export class FixedAssetsController {
  constructor(private readonly fixedAssetsService: FixedAssetsService) {}

  @Post()
  create(@Body() body: any) {
    return this.fixedAssetsService.create(body);
  }

  @Get()
  findAll() {
    return this.fixedAssetsService.findAll();
  }

  @Post(':id/depreciate')
  calculateDepreciation(@Param('id') id: string) {
    return this.fixedAssetsService.calculateDepreciation(id);
  }
}
