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
  Res,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { InvoicesService } from './services/invoices.service';
import { InvoiceVoucherService } from './services/invoice-voucher.service';
import { InvoicePdfService } from './services/invoice-pdf.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { InvoiceFilterDto } from './dto/invoice-filter.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentCompany } from '../../common/decorators/current-company.decorator';

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly invoiceVoucherService: InvoiceVoucherService,
    private readonly invoicePdfService: InvoicePdfService,
  ) {}

  @Post()
  async create(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @CurrentCompany() companyId: string,
  ) {
    return this.invoicesService.create(createInvoiceDto, companyId);
  }

  @Get()
  async findAll(
    @Query() filterDto: InvoiceFilterDto,
    @CurrentCompany() companyId: string,
  ) {
    return this.invoicesService.findAll(filterDto, companyId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentCompany() companyId: string,
  ) {
    return this.invoicesService.findOne(id, companyId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
    @CurrentCompany() companyId: string,
  ) {
    return this.invoicesService.update(id, updateInvoiceDto, companyId);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentCompany() companyId: string,
  ) {
    await this.invoicesService.remove(id, companyId);
    return { message: 'Invoice deleted successfully' };
  }

  @Post(':id/issue')
  async issue(
    @Param('id') id: string,
    @CurrentCompany() companyId: string,
  ) {
    return this.invoicesService.issueInvoice(id, companyId);
  }

  @Post(':id/cancel')
  async cancel(
    @Param('id') id: string,
    @CurrentCompany() companyId: string,
  ) {
    return this.invoicesService.cancelInvoice(id, companyId);
  }

  @Post(':id/payment')
  async recordPayment(
    @Param('id') id: string,
    @Body() recordPaymentDto: RecordPaymentDto,
    @CurrentCompany() companyId: string,
  ) {
    const invoice = await this.invoicesService.recordPayment(
      id,
      recordPaymentDto,
      companyId,
    );

    // Generate payment voucher
    await this.invoiceVoucherService.generateVoucherFromPayment(
      invoice,
      recordPaymentDto.amount.toString(),
    );

    return invoice;
  }

  @Post(':id/generate-voucher')
  async generateVoucher(
    @Param('id') id: string,
    @CurrentCompany() companyId: string,
  ) {
    const invoice = await this.invoicesService.findOne(id, companyId);
    await this.invoiceVoucherService.generateVoucherFromInvoice(invoice);
    return { message: 'Voucher generated successfully' };
  }

  @Get(':id/pdf')
  async generatePdf(
    @Param('id') id: string,
    @CurrentCompany() companyId: string,
    @Res() res: Response,
  ) {
    const invoice = await this.invoicesService.findOne(id, companyId);
    const pdfBuffer = await this.invoicePdfService.generateInvoicePdf(invoice);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.status(HttpStatus.OK).send(pdfBuffer);
  }
}
