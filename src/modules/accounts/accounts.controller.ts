import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentCompany } from '../../common/decorators/current-company.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
    constructor(private readonly accountsService: AccountsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new account' })
    create(
        @CurrentCompany() companyId: string,
        @Body() createAccountDto: CreateAccountDto,
    ) {
        return this.accountsService.create(companyId, createAccountDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all accounts for current company' })
    findAll(@CurrentCompany() companyId: string) {
        return this.accountsService.findAll(companyId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an account by ID' })
    findOne(@Param('id') id: string, @CurrentCompany() companyId: string) {
        return this.accountsService.findOne(id, companyId);
    }
}
