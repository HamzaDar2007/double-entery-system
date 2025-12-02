import { IsOptional, IsEnum, IsDateString, IsUUID, IsString } from 'class-validator';
import { InvoiceStatus } from '../../../common/enums/invoice-status.enum';
import { InvoiceType } from '../../../common/enums/invoice-type.enum';

export class InvoiceFilterDto {
  @IsEnum(InvoiceType)
  @IsOptional()
  invoiceType?: InvoiceType;

  @IsEnum(InvoiceStatus)
  @IsOptional()
  status?: InvoiceStatus;

  @IsUUID()
  @IsOptional()
  customerId?: string;

  @IsUUID()
  @IsOptional()
  supplierId?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;
}
