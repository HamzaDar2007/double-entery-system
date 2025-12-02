import {
  IsEnum,
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InvoiceType } from '../../../common/enums/invoice-type.enum';
import { CreateInvoiceLineDto } from './create-invoice-line.dto';

export class CreateInvoiceDto {
  @IsString()
  invoiceNumber: string;

  @IsEnum(InvoiceType)
  invoiceType: InvoiceType;

  @IsDateString()
  invoiceDate: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  referenceNumber?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  terms?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  discountPercentage?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discountAmount?: number;

  @IsUUID()
  @IsOptional()
  customerId?: string;

  @IsUUID()
  @IsOptional()
  supplierId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceLineDto)
  lines: CreateInvoiceLineDto[];

  @IsOptional()
  isRecurring?: boolean;

  @IsString()
  @IsOptional()
  recurringFrequency?: string;

  @IsDateString()
  @IsOptional()
  nextInvoiceDate?: string;

  @IsString()
  @IsOptional()
  attachmentUrl?: string;
}
