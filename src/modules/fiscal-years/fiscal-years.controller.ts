import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    UseGuards,
} from '@nestjs/common';
import { FiscalYearsService } from './fiscal-years.service';
import { CreateFiscalYearDto } from './dto/create-fiscal-year.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentCompany } from '../../common/decorators/current-company.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Fiscal Years')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('fiscal-years')
export class FiscalYearsController {
    constructor(private readonly fiscalYearsService: FiscalYearsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new fiscal year' })
    create(
        @CurrentCompany() companyId: string,
        @Body() createFiscalYearDto: CreateFiscalYearDto,
    ) {
        return this.fiscalYearsService.create(companyId, createFiscalYearDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all fiscal years for current company' })
    findAll(@CurrentCompany() companyId: string) {
        return this.fiscalYearsService.findAll(companyId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a fiscal year by ID' })
    findOne(@Param('id') id: string, @CurrentCompany() companyId: string) {
        return this.fiscalYearsService.findOne(id, companyId);
    }

    @Patch(':id/close')
    @ApiOperation({ summary: 'Close a fiscal year' })
    closeYear(
        @Param('id') id: string,
        @CurrentCompany() companyId: string,
        @CurrentUser() user: any,
    ) {
        return this.fiscalYearsService.closeYear(id, companyId, user.id);
    }
}
