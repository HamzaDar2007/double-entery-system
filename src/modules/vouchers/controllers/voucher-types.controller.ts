import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { VoucherTypesService } from '../services/voucher-types.service';
import { CreateVoucherTypeDto } from '../dto/create-voucher-type.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentCompany } from '../../../common/decorators/current-company.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Voucher Types')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('voucher-types')
export class VoucherTypesController {
    constructor(private readonly voucherTypesService: VoucherTypesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new voucher type' })
    create(
        @CurrentCompany() companyId: string,
        @Body() createVoucherTypeDto: CreateVoucherTypeDto,
    ) {
        return this.voucherTypesService.create(companyId, createVoucherTypeDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all voucher types' })
    findAll(@CurrentCompany() companyId: string) {
        return this.voucherTypesService.findAll(companyId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a voucher type by ID' })
    findOne(@Param('id') id: string, @CurrentCompany() companyId: string) {
        return this.voucherTypesService.findOne(id, companyId);
    }
}
