import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { FiscalYear } from './entities/fiscal-year.entity';
import { CreateFiscalYearDto } from './dto/create-fiscal-year.dto';

@Injectable()
export class FiscalYearsService {
    constructor(
        @InjectRepository(FiscalYear)
        private fiscalYearRepository: Repository<FiscalYear>,
    ) { }

    async create(
        companyId: string,
        createFiscalYearDto: CreateFiscalYearDto,
    ): Promise<FiscalYear> {
        // Check for overlapping years
        const existingYear = await this.fiscalYearRepository.findOne({
            where: {
                companyId,
                yearName: createFiscalYearDto.yearName,
            },
        });

        if (existingYear) {
            throw new BadRequestException('Fiscal year with this name already exists');
        }

        const fiscalYear = this.fiscalYearRepository.create({
            ...createFiscalYearDto,
            companyId,
        });

        return this.fiscalYearRepository.save(fiscalYear);
    }

    async findAll(companyId: string): Promise<FiscalYear[]> {
        if (!companyId) {
            return [];
        }

        return this.fiscalYearRepository.find({
            where: { companyId },
            order: { startDate: 'DESC' },
        });
    }

    async findOne(id: string, companyId: string): Promise<FiscalYear> {
        const fiscalYear = await this.fiscalYearRepository.findOne({
            where: { id, companyId },
        });

        if (!fiscalYear) {
            throw new NotFoundException(`Fiscal year with ID ${id} not found`);
        }

        return fiscalYear;
    }

    async findByDate(companyId: string, date: Date): Promise<FiscalYear | null> {
        return this.fiscalYearRepository.findOne({
            where: {
                companyId,
                startDate: LessThanOrEqual(date),
                endDate: MoreThanOrEqual(date),
            },
        });
    }

    async closeYear(
        id: string,
        companyId: string,
        userId: string,
    ): Promise<FiscalYear> {
        const fiscalYear = await this.findOne(id, companyId);

        if (fiscalYear.isClosed) {
            throw new BadRequestException('Fiscal year is already closed');
        }

        // TODO: Add validation checks (e.g., all periods closed, no draft vouchers)

        fiscalYear.isClosed = true;
        fiscalYear.closedAt = new Date();
        fiscalYear.closedBy = userId;

        return this.fiscalYearRepository.save(fiscalYear);
    }
}
