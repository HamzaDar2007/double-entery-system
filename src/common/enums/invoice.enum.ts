export enum InvoiceType {
    SALES = 'sales',
    PURCHASE = 'purchase',
}

export enum InvoiceStatus {
    DRAFT = 'draft',
    ISSUED = 'issued',
    PARTIALLY_PAID = 'partially_paid',
    PAID = 'paid',
    OVERDUE = 'overdue',
    CANCELLED = 'cancelled',
}
