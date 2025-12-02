import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxCategoriesService } from './tax-categories.service';
import { TaxCategoriesController } from './tax-categories.controller';
import { TaxCategory } from './entities/tax-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaxCategory])],
  controllers: [TaxCategoriesController],
  providers: [TaxCategoriesService],
  exports: [TaxCategoriesService],
})
export class TaxCategoriesModule {}
