import {
    IsString,
    IsNotEmpty,
    IsEnum,
    IsOptional,
    IsBoolean,
    IsNumber,
    IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AccountType } from '../../../common/enums/account-type.enum';
import { AccountLevel } from '../../../common/enums/account-level.enum';

export class CreateAccountDto {
    @ApiProperty({ example: '1000-00-000-00' })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({ example: 'Cash on Hand' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Main cash account' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ enum: AccountType })
    @IsEnum(AccountType)
    type: AccountType;

    @ApiProperty({ enum: AccountLevel })
    @IsEnum(AccountLevel)
    level: AccountLevel;

    @ApiProperty({ example: 'uuid-of-parent', required: false })
    @IsOptional()
    @IsUUID()
    parentId?: string;

    @ApiProperty({ default: false })
    @IsOptional()
    @IsBoolean()
    isPosting?: boolean;

    @ApiProperty({ default: 0 })
    @IsOptional()
    @IsNumber()
    openingBalance?: number;

    @ApiProperty({ enum: ['debit', 'credit'], required: false })
    @IsOptional()
    @IsString()
    openingBalanceType?: 'debit' | 'credit';

    @ApiProperty({ example: 'USD', required: false })
    @IsOptional()
    @IsString()
    currencyCode?: string;

    @ApiProperty({ default: false })
    @IsOptional()
    @IsBoolean()
    allowReconciliation?: boolean;

    @ApiProperty({ example: 'uuid-of-tax-category', required: false })
    @IsOptional()
    @IsUUID()
    taxCategoryId?: string;
}
