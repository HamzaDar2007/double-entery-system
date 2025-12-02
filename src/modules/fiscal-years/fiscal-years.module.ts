import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FiscalYearsService } from './fiscal-years.service';
import { FiscalYearsController } from './fiscal-years.controller';
import { FiscalYear } from './entities/fiscal-year.entity';

@Module({
    imports: [TypeOrmModule.forFeature([FiscalYear])],
    controllers: [FiscalYearsController],
    providers: [FiscalYearsService],
    exports: [FiscalYearsService],
})
export class FiscalYearsModule { }
