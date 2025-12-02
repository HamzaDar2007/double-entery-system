import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFiscalYearDto {
    @ApiProperty({ example: 'FY 2024' })
    @IsString()
    @IsNotEmpty()
    yearName: string;

    @ApiProperty({ example: '2024-01-01' })
    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @ApiProperty({ example: '2024-12-31' })
    @IsDateString()
    @IsNotEmpty()
    endDate: string;
}
