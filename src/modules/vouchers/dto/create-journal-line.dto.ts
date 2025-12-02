import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsNumber,
    IsUUID,
    Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJournalLineDto {
    @ApiProperty({ example: 'uuid-of-account' })
    @IsUUID()
    @IsNotEmpty()
    accountId: string;

    @ApiProperty({ example: 'Payment for services' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ default: 0 })
    @IsNumber()
    @Min(0)
    debit: number;

    @ApiProperty({ default: 0 })
    @IsNumber()
    @Min(0)
    credit: number;

    @ApiProperty({ example: 'uuid-of-cost-center', required: false })
    @IsOptional()
    @IsUUID()
    costCenterId?: string;

    @ApiProperty({ example: 'uuid-of-project', required: false })
    @IsOptional()
    @IsUUID()
    projectId?: string;

    @ApiProperty({ example: 'uuid-of-customer', required: false })
    @IsOptional()
    @IsUUID()
    customerId?: string;

    @ApiProperty({ example: 'uuid-of-supplier', required: false })
    @IsOptional()
    @IsUUID()
    supplierId?: string;
}
