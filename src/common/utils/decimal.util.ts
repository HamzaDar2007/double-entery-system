import { Decimal } from 'decimal.js';

export class DecimalUtil {
    /**
     * Add two decimal numbers
     */
    static add(a: number | string, b: number | string): string {
        return new Decimal(a).plus(new Decimal(b)).toFixed(2);
    }

    /**
     * Subtract two decimal numbers
     */
    static subtract(a: number | string, b: number | string): string {
        return new Decimal(a).minus(new Decimal(b)).toFixed(2);
    }

    /**
     * Multiply two decimal numbers
     */
    static multiply(a: number | string, b: number | string): string {
        return new Decimal(a).times(new Decimal(b)).toFixed(2);
    }

    /**
     * Divide two decimal numbers
     */
    static divide(a: number | string, b: number | string): string {
        return new Decimal(a).dividedBy(new Decimal(b)).toFixed(2);
    }

    /**
     * Compare two decimal numbers
     * Returns: -1 if a < b, 0 if a === b, 1 if a > b
     */
    static compare(a: number | string, b: number | string): number {
        return new Decimal(a).comparedTo(new Decimal(b));
    }

    /**
     * Check if two decimal numbers are equal
     */
    static equals(a: number | string, b: number | string): boolean {
        return new Decimal(a).equals(new Decimal(b));
    }

    /**
     * Round a decimal number to specified decimal places
     */
    static round(value: number | string, decimalPlaces: number = 2): string {
        return new Decimal(value).toFixed(decimalPlaces);
    }

    /**
     * Convert to number (use with caution for display only)
     */
    static toNumber(value: number | string): number {
        return new Decimal(value).toNumber();
    }

    /**
     * Calculate percentage
     */
    static percentage(value: number | string, percent: number | string): string {
        return new Decimal(value)
            .times(new Decimal(percent))
            .dividedBy(100)
            .toFixed(2);
    }

    /**
     * Sum an array of decimal numbers
     */
    static sum(values: (number | string)[]): string {
        return values
            .reduce((acc, val) => acc.plus(new Decimal(val)), new Decimal(0))
            .toFixed(2);
    }
}
