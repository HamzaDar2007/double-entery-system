import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateCostCenterDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  budgetAmount?: number;

  @IsUUID()
  @IsOptional()
  parentId?: string;
}
