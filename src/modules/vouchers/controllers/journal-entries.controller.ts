import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    UseGuards,
} from '@nestjs/common';
import { JournalEntriesService } from '../services/journal-entries.service';
import { CreateJournalEntryDto } from '../dto/create-journal-entry.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentCompany } from '../../../common/decorators/current-company.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Journal Entries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('journal-entries')
export class JournalEntriesController {
    constructor(
        private readonly journalEntriesService: JournalEntriesService,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create a new journal entry' })
    create(
        @CurrentCompany() companyId: string,
        @CurrentUser() user: any,
        @Body() createJournalEntryDto: CreateJournalEntryDto,
    ) {
        return this.journalEntriesService.create(
            companyId,
            createJournalEntryDto,
            user.id,
        );
    }

    @Get()
    @ApiOperation({ summary: 'Get all journal entries' })
    findAll(@CurrentCompany() companyId: string) {
        return this.journalEntriesService.findAll(companyId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a journal entry by ID' })
    findOne(@Param('id') id: string, @CurrentCompany() companyId: string) {
        return this.journalEntriesService.findOne(id, companyId);
    }

    @Patch(':id/approve')
    @ApiOperation({ summary: 'Approve a journal entry' })
    approve(
        @Param('id') id: string,
        @CurrentCompany() companyId: string,
        @CurrentUser() user: any,
    ) {
        return this.journalEntriesService.approve(id, companyId, user.id);
    }

    @Patch(':id/post')
    @ApiOperation({ summary: 'Post a journal entry' })
    post(
        @Param('id') id: string,
        @CurrentCompany() companyId: string,
        @CurrentUser() user: any,
    ) {
        return this.journalEntriesService.post(id, companyId, user.id);
    }
}
