import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

export class DateUtil {
    /**
     * Get current date
     */
    static now(): Date {
        return dayjs().toDate();
    }

    /**
     * Format date to string
     */
    static format(date: Date | string, format: string = 'YYYY-MM-DD'): string {
        return dayjs(date).format(format);
    }

    /**
     * Parse string to date
     */
    static parse(dateString: string, format?: string): Date {
        return format
            ? dayjs(dateString, format).toDate()
            : dayjs(dateString).toDate();
    }

    /**
     * Add days to date
     */
    static addDays(date: Date | string, days: number): Date {
        return dayjs(date).add(days, 'day').toDate();
    }

    /**
     * Add months to date
     */
    static addMonths(date: Date | string, months: number): Date {
        return dayjs(date).add(months, 'month').toDate();
    }

    /**
     * Add years to date
     */
    static addYears(date: Date | string, years: number): Date {
        return dayjs(date).add(years, 'year').toDate();
    }

    /**
     * Get start of day
     */
    static startOfDay(date: Date | string): Date {
        return dayjs(date).startOf('day').toDate();
    }

    /**
     * Get end of day
     */
    static endOfDay(date: Date | string): Date {
        return dayjs(date).endOf('day').toDate();
    }

    /**
     * Get start of month
     */
    static startOfMonth(date: Date | string): Date {
        return dayjs(date).startOf('month').toDate();
    }

    /**
     * Get end of month
     */
    static endOfMonth(date: Date | string): Date {
        return dayjs(date).endOf('month').toDate();
    }

    /**
     * Get start of year
     */
    static startOfYear(date: Date | string): Date {
        return dayjs(date).startOf('year').toDate();
    }

    /**
     * Get end of year
     */
    static endOfYear(date: Date | string): Date {
        return dayjs(date).endOf('year').toDate();
    }

    /**
     * Check if date is between two dates
     */
    static isBetween(
        date: Date | string,
        startDate: Date | string,
        endDate: Date | string,
    ): boolean {
        return dayjs(date).isBetween(startDate, endDate, null, '[]');
    }

    /**
     * Get difference in days
     */
    static diffInDays(date1: Date | string, date2: Date | string): number {
        return dayjs(date1).diff(dayjs(date2), 'day');
    }

    /**
     * Check if date is after another date
     */
    static isAfter(date1: Date | string, date2: Date | string): boolean {
        return dayjs(date1).isAfter(dayjs(date2));
    }

    /**
     * Check if date is before another date
     */
    static isBefore(date1: Date | string, date2: Date | string): boolean {
        return dayjs(date1).isBefore(dayjs(date2));
    }

    /**
     * Get fiscal year start date based on fiscal month
     */
    static getFiscalYearStart(
        date: Date | string,
        fiscalStartMonth: number,
    ): Date {
        const currentDate = dayjs(date);
        const currentMonth = currentDate.month() + 1; // dayjs months are 0-indexed

        if (currentMonth >= fiscalStartMonth) {
            return dayjs(date)
                .month(fiscalStartMonth - 1)
                .startOf('month')
                .toDate();
        } else {
            return dayjs(date)
                .subtract(1, 'year')
                .month(fiscalStartMonth - 1)
                .startOf('month')
                .toDate();
        }
    }

    /**
     * Get fiscal year end date based on fiscal month
     */
    static getFiscalYearEnd(date: Date | string, fiscalStartMonth: number): Date {
        const fiscalStart = this.getFiscalYearStart(date, fiscalStartMonth);
        return dayjs(fiscalStart).add(1, 'year').subtract(1, 'day').toDate();
    }
}
