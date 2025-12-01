import { IsString, IsNotEmpty, IsOptional, IsEmail, Length, IsInt, Min, Max, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
    @ApiProperty({ example: 'Acme Corp' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Acme Corporation Ltd.' })
    @IsOptional()
    @IsString()
    legalName?: string;

    @ApiProperty({ example: 'REG123456' })
    @IsOptional()
    @IsString()
    registrationNo?: string;

    @ApiProperty({ example: 'TAX123456' })
    @IsOptional()
    @IsString()
    taxRegistrationNo?: string;

    @ApiProperty({ example: 'USA' })
    @IsString()
    @Length(3, 3)
    countryCode: string;

    @ApiProperty({ example: 'USD' })
    @IsString()
    @Length(3, 3)
    currencyCode: string;

    @ApiProperty({ example: 1, description: 'Start month of fiscal year (1-12)' })
    @IsInt()
    @Min(1)
    @Max(12)
    fiscalYearStartMonth: number;

    @ApiProperty({ example: '123 Main St, New York, NY' })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty({ example: '+1234567890' })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ example: 'contact@acme.com' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({ example: 'https://acme.com/logo.png' })
    @IsOptional()
    @IsUrl()
    logoUrl?: string;
}
