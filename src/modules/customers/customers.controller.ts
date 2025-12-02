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
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentCompany } from '../../common/decorators/current-company.decorator';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(
    @Body() createCustomerDto: CreateCustomerDto,
    @CurrentCompany() companyId: string,
  ) {
    return this.customersService.create(createCustomerDto, companyId);
  }

  @Get()
  findAll(
    @CurrentCompany() companyId: string,
    @Query('search') search?: string,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.customersService.findAll(companyId, search, isActive);
  }

  @Get('with-balance')
  getCustomersWithBalance(@CurrentCompany() companyId: string) {
    return this.customersService.getCustomersWithBalance(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentCompany() companyId: string) {
    return this.customersService.findOne(id, companyId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @CurrentCompany() companyId: string,
  ) {
    return this.customersService.update(id, updateCustomerDto, companyId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentCompany() companyId: string) {
    await this.customersService.remove(id, companyId);
    return { message: 'Customer deleted successfully' };
  }
}
