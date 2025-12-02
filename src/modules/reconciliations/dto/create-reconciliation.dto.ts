import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReconciliationDto {
  @IsString()
  @IsNotEmpty()
  bankAccountId: string;

  @IsDateString()
  @IsNotEmpty()
  statementDate: string;

  @IsNumber()
  @IsNotEmpty()
  statementBalance: number;
}
