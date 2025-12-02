import { Injectable } from '@nestjs/common';
import { Invoice } from '../entities/invoice.entity';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';
import Decimal from 'decimal.js';

@Injectable()
export class InvoicePdfService {
  async generateInvoicePdf(invoice: Invoice): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc
        .fontSize(20)
        .text(invoice.invoiceType.toUpperCase() + ' INVOICE', 50, 50, {
          align: 'center',
        });

      doc.moveDown();

      // Company Info (left side)
      doc.fontSize(10).text('From:', 50, 120);
      doc.fontSize(12).text('Your Company Name', 50, 135);
      doc.fontSize(10).text('Company Address', 50, 150);
      doc.text('City, State, ZIP', 50, 165);

      // Customer/Supplier Info (right side)
      const partyLabel =
        invoice.invoiceType === 'sales' ? 'Bill To:' : 'Bill From:';
      const partyName =
        invoice.customer?.name || invoice.supplier?.name || 'N/A';

      doc.fontSize(10).text(partyLabel, 350, 120);
      doc.fontSize(12).text(partyName, 350, 135);

      // Invoice Details
      doc.fontSize(10);
      doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 50, 220);
      doc.text(
        `Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`,
        50,
        235,
      );
      if (invoice.dueDate) {
        doc.text(
          `Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`,
          50,
          250,
        );
      }
      if (invoice.referenceNumber) {
        doc.text(`Reference: ${invoice.referenceNumber}`, 50, 265);
      }

      // Table Header
      const tableTop = 320;
      doc.fontSize(10).font('Helvetica-Bold');

      doc.text('#', 50, tableTop);
      doc.text('Description', 80, tableTop);
      doc.text('Qty', 300, tableTop, { width: 50, align: 'right' });
      doc.text('Price', 360, tableTop, { width: 70, align: 'right' });
      doc.text('Discount', 440, tableTop, { width: 60, align: 'right' });
      doc.text('Amount', 510, tableTop, { width: 80, align: 'right' });

      // Draw line under header
      doc
        .moveTo(50, tableTop + 15)
        .lineTo(590, tableTop + 15)
        .stroke();

      // Table Rows
      doc.font('Helvetica');
      let yPosition = tableTop + 25;

      invoice.lines.forEach((line, index) => {
        if (yPosition > 700) {
          doc.addPage();
          yPosition = 50;
        }

        doc.text(line.lineNumber.toString(), 50, yPosition);
        doc.text(line.description, 80, yPosition, { width: 200 });
        doc.text(line.quantity, 300, yPosition, { width: 50, align: 'right' });
        doc.text(
          new Decimal(line.unitPrice).toFixed(2),
          360,
          yPosition,
          { width: 70, align: 'right' },
        );
        doc.text(
          new Decimal(line.discountAmount).toFixed(2),
          440,
          yPosition,
          { width: 60, align: 'right' },
        );
        doc.text(
          new Decimal(line.netAmount).toFixed(2),
          510,
          yPosition,
          { width: 80, align: 'right' },
        );

        yPosition += 20;
      });

      // Draw line before totals
      yPosition += 10;
      doc
        .moveTo(50, yPosition)
        .lineTo(590, yPosition)
        .stroke();

      // Totals
      yPosition += 15;
      doc.font('Helvetica');

      doc.text('Subtotal:', 400, yPosition);
      doc.text(
        new Decimal(invoice.subtotal).toFixed(2),
        510,
        yPosition,
        { width: 80, align: 'right' },
      );

      yPosition += 20;
      doc.text('Discount:', 400, yPosition);
      doc.text(
        new Decimal(invoice.discountAmount).toFixed(2),
        510,
        yPosition,
        { width: 80, align: 'right' },
      );

      yPosition += 20;
      doc.text('Tax:', 400, yPosition);
      doc.text(
        new Decimal(invoice.taxAmount).toFixed(2),
        510,
        yPosition,
        { width: 80, align: 'right' },
      );

      yPosition += 20;
      doc.font('Helvetica-Bold').fontSize(12);
      doc.text('Total:', 400, yPosition);
      doc.text(
        new Decimal(invoice.totalAmount).toFixed(2),
        510,
        yPosition,
        { width: 80, align: 'right' },
      );

      yPosition += 20;
      doc.font('Helvetica').fontSize(10);
      doc.text('Paid:', 400, yPosition);
      doc.text(
        new Decimal(invoice.paidAmount).toFixed(2),
        510,
        yPosition,
        { width: 80, align: 'right' },
      );

      yPosition += 20;
      doc.font('Helvetica-Bold');
      doc.text('Balance Due:', 400, yPosition);
      doc.text(
        new Decimal(invoice.balanceAmount).toFixed(2),
        510,
        yPosition,
        { width: 80, align: 'right' },
      );

      // Notes
      if (invoice.notes) {
        yPosition += 40;
        doc.font('Helvetica').fontSize(10);
        doc.text('Notes:', 50, yPosition);
        doc.text(invoice.notes, 50, yPosition + 15, { width: 500 });
      }

      // Terms
      if (invoice.terms) {
        yPosition += 60;
        doc.text('Terms & Conditions:', 50, yPosition);
        doc.text(invoice.terms, 50, yPosition + 15, { width: 500 });
      }

      // Footer
      doc
        .fontSize(8)
        .text(
          'Thank you for your business!',
          50,
          750,
          { align: 'center', width: 500 },
        );

      doc.end();
    });
  }
}
