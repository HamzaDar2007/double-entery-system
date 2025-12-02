import {
  IsString,
  IsOptional,
  IsEmail,
  IsNumber,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  customerCode: string;

  @IsString()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  mobile?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  taxNumber?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  creditLimit?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  creditDays?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  contactPerson?: string;

  @IsString()
  @IsOptional()
  paymentTerms?: string;
}
