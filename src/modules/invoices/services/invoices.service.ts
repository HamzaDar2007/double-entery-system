import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';
import { InvoiceLine } from '../entities/invoice-line.entity';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { UpdateInvoiceDto } from '../dto/update-invoice.dto';
import { InvoiceFilterDto } from '../dto/invoice-filter.dto';
import { RecordPaymentDto } from '../dto/record-payment.dto';
import { InvoiceStatus } from '../../../common/enums/invoice-status.enum';
import { InvoiceType } from '../../../common/enums/invoice-type.enum';
import Decimal from 'decimal.js';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceLine)
    private readonly invoiceLineRepository: Repository<InvoiceLine>,
  ) {}

  async create(
    createInvoiceDto: CreateInvoiceDto,
    companyId: string,
  ): Promise<Invoice> {
    // Validate customer/supplier based on invoice type
    if (createInvoiceDto.invoiceType === InvoiceType.SALES && !createInvoiceDto.customerId) {
      throw new BadRequestException('Customer is required for sales invoice');
    }
    if (createInvoiceDto.invoiceType === InvoiceType.PURCHASE && !createInvoiceDto.supplierId) {
      throw new BadRequestException('Supplier is required for purchase invoice');
    }

    // Calculate totals
    const calculations = this.calculateInvoiceTotals(createInvoiceDto.lines);

    const invoice = this.invoiceRepository.create({
      ...createInvoiceDto,
      companyId,
      subtotal: calculations.subtotal.toString(),
      taxAmount: calculations.taxAmount.toString(),
      discountAmount: calculations.discountAmount.toString(),
      totalAmount: calculations.totalAmount.toString(),
      paidAmount: '0',
      balanceAmount: calculations.totalAmount.toString(),
      status: InvoiceStatus.DRAFT,
      discountPercentage: (createInvoiceDto.discountPercentage || 0).toString(),
    } as unknown as DeepPartial<Invoice>);

    const savedInvoice = await this.invoiceRepository.save(invoice);

    // Create invoice lines
    const lines = createInvoiceDto.lines.map((lineDto, index) => {
      const lineCalc = this.calculateLineTotals(lineDto);
      return this.invoiceLineRepository.create({
        ...lineDto,
        invoiceId: savedInvoice.id,
        lineNumber: index + 1,
        lineTotal: lineCalc.lineTotal.toString(),
        discountAmount: lineCalc.discountAmount.toString(),
        taxAmount: lineCalc.taxAmount.toString(),
        netAmount: lineCalc.netAmount.toString(),
        quantity: lineDto.quantity.toString(),
        unitPrice: lineDto.unitPrice.toString(),
        discountPercentage: (lineDto.discountPercentage || 0).toString(),
        taxPercentage: '0', // Will be set from tax category
      } as unknown as DeepPartial<InvoiceLine>);
    });

    await this.invoiceLineRepository.save(lines);

    return this.findOne(savedInvoice.id, companyId);
  }

  async findAll(
    filterDto: InvoiceFilterDto,
    companyId: string,
  ): Promise<{ data: Invoice[]; total: number }> {
    const query = this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.customer', 'customer')
      .leftJoinAndSelect('invoice.supplier', 'supplier')
      .leftJoinAndSelect('invoice.lines', 'lines')
      .where('invoice.company_id = :companyId', { companyId });

    if (filterDto.invoiceType) {
      query.andWhere('invoice.invoice_type = :invoiceType', {
        invoiceType: filterDto.invoiceType,
      });
    }

    if (filterDto.status) {
      query.andWhere('invoice.status = :status', { status: filterDto.status });
    }

    if (filterDto.customerId) {
      query.andWhere('invoice.customer_id = :customerId', {
        customerId: filterDto.customerId,
      });
    }

    if (filterDto.supplierId) {
      query.andWhere('invoice.supplier_id = :supplierId', {
        supplierId: filterDto.supplierId,
      });
    }

    if (filterDto.startDate) {
      query.andWhere('invoice.invoice_date >= :startDate', {
        startDate: filterDto.startDate,
      });
    }

    if (filterDto.endDate) {
      query.andWhere('invoice.invoice_date <= :endDate', {
        endDate: filterDto.endDate,
      });
    }

    if (filterDto.search) {
      query.andWhere(
        '(invoice.invoice_number ILIKE :search OR invoice.reference_number ILIKE :search OR invoice.description ILIKE :search)',
        { search: `%${filterDto.search}%` },
      );
    }

    const total = await query.getCount();

    const page = filterDto.page || 1;
    const limit = filterDto.limit || 10;
    const skip = (page - 1) * limit;

    const data = await query
      .orderBy('invoice.invoice_date', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    return { data, total };
  }

  async findOne(id: string, companyId: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id, companyId },
      relations: ['customer', 'supplier', 'lines', 'lines.item', 'lines.taxCategory'],
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return invoice;
  }

  async update(
    id: string,
    updateInvoiceDto: UpdateInvoiceDto,
    companyId: string,
  ): Promise<Invoice> {
    const invoice = await this.findOne(id, companyId);

    // Don't allow updates if invoice is issued or paid
    if (invoice.status === InvoiceStatus.PAID || invoice.status === InvoiceStatus.ISSUED) {
      throw new BadRequestException(
        'Cannot update invoice that is issued or paid',
      );
    }

    // If lines are being updated, recalculate totals
    if (updateInvoiceDto.lines) {
      const calculations = this.calculateInvoiceTotals(updateInvoiceDto.lines);
      
      Object.assign(invoice, {
        ...updateInvoiceDto,
        subtotal: calculations.subtotal.toString(),
        taxAmount: calculations.taxAmount.toString(),
        discountAmount: calculations.discountAmount.toString(),
        totalAmount: calculations.totalAmount.toString(),
        balanceAmount: new Decimal(calculations.totalAmount)
          .minus(invoice.paidAmount)
          .toString(),
      });

      // Delete old lines and create new ones
      await this.invoiceLineRepository.delete({ invoiceId: id });
      
      const lines = updateInvoiceDto.lines.map((lineDto, index) => {
        const lineCalc = this.calculateLineTotals(lineDto);
        return this.invoiceLineRepository.create({
          ...lineDto,
          invoiceId: id,
          lineNumber: index + 1,
          lineTotal: lineCalc.lineTotal.toString(),
          discountAmount: lineCalc.discountAmount.toString(),
          taxAmount: lineCalc.taxAmount.toString(),
          netAmount: lineCalc.netAmount.toString(),
          quantity: lineDto.quantity.toString(),
          unitPrice: lineDto.unitPrice.toString(),
          discountPercentage: (lineDto.discountPercentage || 0).toString(),
          taxPercentage: '0',
        } as unknown as DeepPartial<InvoiceLine>);
      });

      await this.invoiceLineRepository.save(lines);
    } else {
      Object.assign(invoice, updateInvoiceDto);
    }

    await this.invoiceRepository.save(invoice);
    return this.findOne(id, companyId);
  }

  async remove(id: string, companyId: string): Promise<void> {
    const invoice = await this.findOne(id, companyId);

    if (invoice.status !== InvoiceStatus.DRAFT) {
      throw new BadRequestException('Only draft invoices can be deleted');
    }

    await this.invoiceRepository.softDelete(id);
  }

  async recordPayment(
    id: string,
    recordPaymentDto: RecordPaymentDto,
    companyId: string,
  ): Promise<Invoice> {
    const invoice = await this.findOne(id, companyId);

    const paidAmount = new Decimal(invoice.paidAmount);
    const newPayment = new Decimal(recordPaymentDto.amount);
    const totalPaid = paidAmount.plus(newPayment);
    const totalAmount = new Decimal(invoice.totalAmount);

    if (totalPaid.greaterThan(totalAmount)) {
      throw new BadRequestException('Payment amount exceeds invoice balance');
    }

    invoice.paidAmount = totalPaid.toString();
    invoice.balanceAmount = totalAmount.minus(totalPaid).toString();

    // Update status based on payment
    if (totalPaid.equals(totalAmount)) {
      invoice.status = InvoiceStatus.PAID;
    } else if (totalPaid.greaterThan(0)) {
      invoice.status = InvoiceStatus.PARTIALLY_PAID;
    }

    await this.invoiceRepository.save(invoice);
    return this.findOne(id, companyId);
  }

  async issueInvoice(id: string, companyId: string): Promise<Invoice> {
    const invoice = await this.findOne(id, companyId);

    if (invoice.status !== InvoiceStatus.DRAFT) {
      throw new BadRequestException('Only draft invoices can be issued');
    }

    invoice.status = InvoiceStatus.ISSUED;
    await this.invoiceRepository.save(invoice);

    return this.findOne(id, companyId);
  }

  async cancelInvoice(id: string, companyId: string): Promise<Invoice> {
    const invoice = await this.findOne(id, companyId);

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Cannot cancel paid invoice');
    }

    invoice.status = InvoiceStatus.CANCELLED;
    await this.invoiceRepository.save(invoice);

    return this.findOne(id, companyId);
  }

  private calculateLineTotals(lineDto: any) {
    const quantity = new Decimal(lineDto.quantity);
    const unitPrice = new Decimal(lineDto.unitPrice);
    const lineTotal = quantity.times(unitPrice);

    let discountAmount = new Decimal(0);
    if (lineDto.discountPercentage) {
      discountAmount = lineTotal.times(lineDto.discountPercentage).dividedBy(100);
    } else if (lineDto.discountAmount) {
      discountAmount = new Decimal(lineDto.discountAmount);
    }

    const afterDiscount = lineTotal.minus(discountAmount);
    
    // Tax will be calculated from tax category in real implementation
    const taxAmount = new Decimal(0);
    const netAmount = afterDiscount.plus(taxAmount);

    return {
      lineTotal,
      discountAmount,
      taxAmount,
      netAmount,
    };
  }

  private calculateInvoiceTotals(lines: any[]) {
    let subtotal = new Decimal(0);
    let totalDiscount = new Decimal(0);
    let totalTax = new Decimal(0);

    lines.forEach((line) => {
      const calc = this.calculateLineTotals(line);
      subtotal = subtotal.plus(calc.lineTotal);
      totalDiscount = totalDiscount.plus(calc.discountAmount);
      totalTax = totalTax.plus(calc.taxAmount);
    });

    const totalAmount = subtotal.minus(totalDiscount).plus(totalTax);

    return {
      subtotal,
      discountAmount: totalDiscount,
      taxAmount: totalTax,
      totalAmount,
    };
  }
}
