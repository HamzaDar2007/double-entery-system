import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { TaxType } from '../entities/tax-category.entity';

export class CreateTaxCategoryDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaxType)
  type: TaxType;

  @IsNumber()
  @Min(0)
  @Max(100)
  rate: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isCompound?: boolean;

  @IsString()
  @IsOptional()
  taxNumber?: string;
}
