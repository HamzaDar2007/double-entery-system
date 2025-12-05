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

    @Get('hierarchy')
    @ApiOperation({ summary: 'Get account hierarchy (L1 → L2 → L3 → L4)' })
    getHierarchy(@CurrentCompany() companyId: string) {
        return this.accountsService.getHierarchy(companyId);
    }

    @Get('posting-accounts')
    @ApiOperation({ summary: 'Get only posting accounts (L4 accounts for transactions)' })
    getPostingAccounts(@CurrentCompany() companyId: string) {
        return this.accountsService.getPostingAccounts(companyId);
    }

    @Post('rollup-balances')
    @ApiOperation({ summary: 'Rollup all account balances (L4 → L3 → L2 → L1)' })
    async rollupBalances(@CurrentCompany() companyId: string) {
        await this.accountsService.rollupAllBalances(companyId);
        return { message: 'Balance rollup completed successfully' };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an account by ID' })
    findOne(@Param('id') id: string, @CurrentCompany() companyId: string) {
        return this.accountsService.findOne(id, companyId);
    }

    @Get(':id/with-balance')
    @ApiOperation({ summary: 'Get account with calculated balance' })
    getWithBalance(@Param('id') id: string) {
        return this.accountsService.getAccountWithBalance(id);
    }
}
