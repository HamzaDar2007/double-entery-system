import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectStatus } from './entities/project.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentCompany } from '../../common/decorators/current-company.decorator';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentCompany() companyId: string,
  ) {
    return this.projectsService.create(createProjectDto, companyId);
  }

  @Get()
  findAll(
    @CurrentCompany() companyId: string,
    @Query('status') status?: ProjectStatus,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.projectsService.findAll(companyId, status, isActive);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentCompany() companyId: string) {
    return this.projectsService.findOne(id, companyId);
  }

  @Get(':id/variance')
  getVariance(@Param('id') id: string, @CurrentCompany() companyId: string) {
    return this.projectsService.getProjectVariance(id, companyId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentCompany() companyId: string,
  ) {
    return this.projectsService.update(id, updateProjectDto, companyId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentCompany() companyId: string) {
    await this.projectsService.remove(id, companyId);
    return { message: 'Project deleted successfully' };
  }
}
