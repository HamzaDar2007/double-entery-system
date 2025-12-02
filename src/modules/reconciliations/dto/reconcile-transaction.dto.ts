import { IsNotEmpty, IsString } from 'class-validator';

export class ReconcileTransactionDto {
  @IsString()
  @IsNotEmpty()
  transactionId: string;
}
