import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateItemDto {
  @IsString()
  itemCode: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  unitOfMeasure?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  salesPrice?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  purchasePrice?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isInventoryItem?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  currentStock?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  reorderLevel?: number;

  @IsString()
  @IsOptional()
  barcode?: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsUUID()
  @IsOptional()
  salesTaxCategoryId?: string;

  @IsUUID()
  @IsOptional()
  purchaseTaxCategoryId?: string;

  @IsUUID()
  @IsOptional()
  salesAccountId?: string;

  @IsUUID()
  @IsOptional()
  purchaseAccountId?: string;

  @IsUUID()
  @IsOptional()
  inventoryAccountId?: string;
}
