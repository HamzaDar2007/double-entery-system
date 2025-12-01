export class NumberFormatter {
    /**
     * Format number as currency
     */
    static formatCurrency(
        value: number | string,
        currencyCode: string = 'PKR',
        locale: string = 'en-PK',
    ): string {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numValue);
    }

    /**
     * Format number with thousand separators
     */
    static formatNumber(
        value: number | string,
        decimalPlaces: number = 2,
        locale: string = 'en-PK',
    ): string {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        return new Intl.NumberFormat(locale, {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
        }).format(numValue);
    }

    /**
     * Format number as percentage
     */
    static formatPercentage(
        value: number | string,
        decimalPlaces: number = 2,
        locale: string = 'en-PK',
    ): string {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        return new Intl.NumberFormat(locale, {
            style: 'percent',
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
        }).format(numValue / 100);
    }

    /**
     * Format number in accounting format (negative in parentheses)
     */
    static formatAccounting(
        value: number | string,
        currencyCode: string = 'PKR',
        locale: string = 'en-PK',
    ): string {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        const formatted = this.formatCurrency(
            Math.abs(numValue),
            currencyCode,
            locale,
        );
        return numValue < 0 ? `(${formatted})` : formatted;
    }

    /**
     * Parse formatted number string to number
     */
    static parseNumber(value: string): number {
        return parseFloat(value.replace(/[^0-9.-]+/g, ''));
    }
}
