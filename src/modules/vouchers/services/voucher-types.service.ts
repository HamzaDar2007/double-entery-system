import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VoucherType } from '../entities/voucher-type.entity';
import { CreateVoucherTypeDto } from '../dto/create-voucher-type.dto';

@Injectable()
export class VoucherTypesService {
    constructor(
        @InjectRepository(VoucherType)
        private voucherTypeRepository: Repository<VoucherType>,
    ) { }

    async create(
        companyId: string,
        createVoucherTypeDto: CreateVoucherTypeDto,
    ): Promise<VoucherType> {
        const existing = await this.voucherTypeRepository.findOne({
            where: { companyId, code: createVoucherTypeDto.code },
        });

        if (existing) {
            throw new BadRequestException('Voucher type code already exists');
        }

        const voucherType = this.voucherTypeRepository.create({
            ...createVoucherTypeDto,
            companyId,
        });

        return this.voucherTypeRepository.save(voucherType);
    }

    async findAll(companyId: string): Promise<VoucherType[]> {
        return this.voucherTypeRepository.find({
            where: { companyId },
            order: { code: 'ASC' },
        });
    }

    async findOne(id: string, companyId: string): Promise<VoucherType> {
        const voucherType = await this.voucherTypeRepository.findOne({
            where: { id, companyId },
        });

        if (!voucherType) {
            throw new NotFoundException(`Voucher type with ID ${id} not found`);
        }

        return voucherType;
    }
}
