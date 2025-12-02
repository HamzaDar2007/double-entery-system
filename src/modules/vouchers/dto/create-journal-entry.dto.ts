import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsDateString,
    IsUUID,
    ValidateNested,
    ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateJournalLineDto } from './create-journal-line.dto';

export class CreateJournalEntryDto {
    @ApiProperty({ example: 'uuid-of-voucher-type' })
    @IsUUID()
    @IsNotEmpty()
    voucherTypeId: string;

    @ApiProperty({ example: '2024-01-01' })
    @IsDateString()
    @IsNotEmpty()
    entryDate: string;

    @ApiProperty({ example: 'REF123' })
    @IsOptional()
    @IsString()
    reference?: string;

    @ApiProperty({ example: 'Monthly rent payment' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ type: [CreateJournalLineDto] })
    @ValidateNested({ each: true })
    @Type(() => CreateJournalLineDto)
    @ArrayMinSize(2)
    lines: CreateJournalLineDto[];
}
