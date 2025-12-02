import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JournalEntry } from '../entities/journal-entry.entity';
import { CreateJournalEntryDto } from '../dto/create-journal-entry.dto';
import { VoucherTypesService } from './voucher-types.service';
import { FiscalYearsService } from '../../fiscal-years/fiscal-years.service';
import { EntryStatus } from '../../../common/enums/entry-status.enum';
import { Decimal } from 'decimal.js';

@Injectable()
export class JournalEntriesService {
    constructor(
        @InjectRepository(JournalEntry)
        private journalEntryRepository: Repository<JournalEntry>,
        private voucherTypesService: VoucherTypesService,
        private fiscalYearsService: FiscalYearsService,
        private dataSource: DataSource,
    ) { }

    async create(
        companyId: string,
        createDto: CreateJournalEntryDto,
        userId: string,
    ): Promise<JournalEntry> {
        const { voucherTypeId, entryDate, lines } = createDto;

        // Validate Fiscal Year
        const fiscalYear = await this.fiscalYearsService.findByDate(
            companyId,
            new Date(entryDate),
        );
        if (!fiscalYear) {
            throw new BadRequestException('No fiscal year defined for this date');
        }
        if (fiscalYear.isClosed) {
            throw new BadRequestException('Fiscal year is closed');
        }

        // Validate Debits = Credits
        let totalDebit = new Decimal(0);
        let totalCredit = new Decimal(0);

        lines.forEach((line) => {
            totalDebit = totalDebit.plus(line.debit);
            totalCredit = totalCredit.plus(line.credit);
        });

        if (!totalDebit.equals(totalCredit)) {
            throw new BadRequestException(
                `Debits (${totalDebit}) must equal Credits (${totalCredit})`,
            );
        }

        if (totalDebit.isZero()) {
            throw new BadRequestException('Voucher amount cannot be zero');
        }

        // Get Voucher Type
        const voucherType = await this.voucherTypesService.findOne(
            voucherTypeId,
            companyId,
        );

        // Generate Voucher Number using database function
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            let voucherNo = '';
            if (voucherType.autoNumbering) {
                const result = await queryRunner.query(
                    `SELECT generate_voucher_number($1, $2) as voucher_number`,
                    [voucherTypeId, entryDate],
                );
                voucherNo = result[0].voucher_number;
            } else {
                throw new BadRequestException(
                    'Manual voucher numbering not supported yet',
                );
            }

            const entry = this.journalEntryRepository.create({
                ...createDto,
                companyId,
                fiscalYearId: fiscalYear.id,
                voucherNo,
                postingDate: new Date(entryDate),
                status: EntryStatus.DRAFT,
                createdBy: userId,
                lines: lines.map((line) => ({ ...line, companyId })),
            });

            const savedEntry = await queryRunner.manager.save(entry);

            await queryRunner.commitTransaction();
            return savedEntry;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(companyId: string): Promise<JournalEntry[]> {
        return this.journalEntryRepository.find({
            where: { companyId },
            relations: ['lines', 'voucherType'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string, companyId: string): Promise<JournalEntry> {
        const entry = await this.journalEntryRepository.findOne({
            where: { id, companyId },
            relations: ['lines', 'voucherType', 'fiscalYear'],
        });

        if (!entry) {
            throw new NotFoundException(`Journal entry with ID ${id} not found`);
        }

        return entry;
    }

    async post(
        id: string,
        companyId: string,
        userId: string,
    ): Promise<JournalEntry> {
        const entry = await this.findOne(id, companyId);

        if (entry.posted) {
            throw new BadRequestException('Entry is already posted');
        }

        if (entry.status !== EntryStatus.APPROVED) {
            throw new BadRequestException('Entry must be approved before posting');
        }

        entry.posted = true;
        entry.postedAt = new Date();
        entry.postedBy = userId;
        entry.status = EntryStatus.POSTED;

        return this.journalEntryRepository.save(entry);
    }

    async approve(
        id: string,
        companyId: string,
        userId: string,
    ): Promise<JournalEntry> {
        const entry = await this.findOne(id, companyId);

        if (entry.status !== EntryStatus.DRAFT) {
            throw new BadRequestException('Only draft entries can be approved');
        }

        entry.status = EntryStatus.APPROVED;
        entry.approvedBy = userId;
        entry.approvedAt = new Date();

        return this.journalEntryRepository.save(entry);
    }
}
