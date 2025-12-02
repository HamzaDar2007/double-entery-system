import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  Max,
} from 'class-validator';

export class CreateInvoiceLineDto {
  @IsNumber()
  lineNumber: number;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;

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
  itemId?: string;

  @IsUUID()
  @IsOptional()
  taxCategoryId?: string;

  @IsUUID()
  @IsOptional()
  accountId?: string;

  @IsString()
  @IsOptional()
  unitOfMeasure?: string;
}
