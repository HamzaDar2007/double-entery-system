import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoucherType } from './entities/voucher-type.entity';
import { JournalEntry } from './entities/journal-entry.entity';
import { JournalEntryLine } from './entities/journal-entry-line.entity';
import { VoucherTypesService } from './services/voucher-types.service';
import { JournalEntriesService } from './services/journal-entries.service';
import { VoucherTypesController } from './controllers/voucher-types.controller';
import { JournalEntriesController } from './controllers/journal-entries.controller';
import { FiscalYearsModule } from '../fiscal-years/fiscal-years.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([VoucherType, JournalEntry, JournalEntryLine]),
        FiscalYearsModule,
    ],
    controllers: [VoucherTypesController, JournalEntriesController],
    providers: [VoucherTypesService, JournalEntriesService],
    exports: [VoucherTypesService, JournalEntriesService],
})
export class VouchersModule { }
