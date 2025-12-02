import {
    IsString,
    IsNotEmpty,
    IsEnum,
    IsOptional,
    IsBoolean,
    IsNumber,
    Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VoucherNature } from '../../../common/enums/voucher-nature.enum';

export class CreateVoucherTypeDto {
    @ApiProperty({ example: 'BPV' })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({ example: 'Bank Payment Voucher' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ enum: VoucherNature })
    @IsEnum(VoucherNature)
    nature: VoucherNature;

    @ApiProperty({ default: true })
    @IsOptional()
    @IsBoolean()
    autoNumbering?: boolean;

    @ApiProperty({ example: 'BPV-' })
    @IsOptional()
    @IsString()
    prefix?: string;

    @ApiProperty({ default: 1 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    nextSequence?: number;

    @ApiProperty({ enum: ['yearly', 'monthly', 'never'], default: 'yearly' })
    @IsOptional()
    @IsString()
    resetFrequency?: 'yearly' | 'monthly' | 'never';

    @ApiProperty({ default: false })
    @IsOptional()
    @IsBoolean()
    requiresApproval?: boolean;
}
