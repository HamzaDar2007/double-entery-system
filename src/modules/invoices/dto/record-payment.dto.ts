import {
  IsNumber,
  IsDateString,
  IsString,
  IsOptional,
  Min,
} from 'class-validator';

export class RecordPaymentDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsDateString()
  paymentDate: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  referenceNumber?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
