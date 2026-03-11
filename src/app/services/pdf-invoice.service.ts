import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '../models/order.interface';

@Injectable({
  providedIn: 'root'
})
export class PdfInvoiceService {
  // Oasis Water Branding Colors
  private readonly PRIMARY_TEAL = '#00A8C5';
  private readonly SECONDARY_BLUE = '#005B82';
  private readonly TEXT_DARK = '#333333';
  private readonly TEXT_LIGHT = '#666666';

  constructor() { }

  /**
   * Generate and download a PDF invoice for the given order
   */
  generateInvoice(order: Order): void {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    // Header - Company Logo & Title
    doc.setFillColor(0, 168, 197); // Teal
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('OASIS WATER', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Premium Water & Beverage Solutions', pageWidth / 2, 28, { align: 'center' });

    yPosition = 50;

    // Invoice Title
    doc.setTextColor(0, 91, 130); // Secondary blue
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 15, yPosition);
    yPosition += 10;

    // Order Details Section
    doc.setFontSize(10);
    doc.setTextColor(51, 51, 51);
    doc.setFont('helvetica', 'bold');
    doc.text('Order Number:', 15, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(order.orderNumber, 50, yPosition);

    yPosition += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Order Date:', 15, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(order.orderDate).toLocaleDateString('en-ZW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }), 50, yPosition);

    yPosition += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Method:', 15, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(this.formatPaymentMethod(order.paymentMethod), 50, yPosition);

    yPosition += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Status:', 15, yPosition);
    doc.setFont('helvetica', 'normal');
    const paymentStatusColor = order.paymentStatus === 'paid' ? '#059669' : '#F59E0B';
    doc.setTextColor(paymentStatusColor);
    doc.text(order.paymentStatus.toUpperCase(), 50, yPosition);
    doc.setTextColor(51, 51, 51);

    yPosition += 12;

    // Customer Details Section
    doc.setFillColor(240, 240, 240);
    doc.rect(15, yPosition - 5, 180, 35, 'F');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 91, 130);
    doc.text('Customer Information', 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setTextColor(51, 51, 51);
    doc.setFont('helvetica', 'bold');
    doc.text('Name:', 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(`${order.customer.firstName} ${order.customer.lastName}`, 40, yPosition);

    yPosition += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Email:', 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(order.customer.email, 40, yPosition);

    yPosition += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Phone:', 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(order.customer.phone, 40, yPosition);

    yPosition += 12;

    // Fulfillment Details Section
    doc.setFillColor(240, 250, 255);
    doc.rect(15, yPosition - 5, 180, order.fulfillmentType === 'delivery' ? 40 : 30, 'F');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 91, 130);
    doc.text(
      order.fulfillmentType === 'delivery' ? 'Delivery Information' : 'Collection Information',
      20,
      yPosition
    );
    yPosition += 8;

    doc.setFontSize(10);
    doc.setTextColor(51, 51, 51);
    
    if (order.fulfillmentType === 'delivery' && order.deliveryAddress) {
      doc.setFont('helvetica', 'bold');
      doc.text('Delivery Address:', 20, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      doc.text(order.deliveryAddress.street, 20, yPosition);
      yPosition += 5;
      doc.text(`${order.deliveryAddress.suburb}, ${order.deliveryAddress.city}`, 20, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'bold');
      doc.text('Delivery Date & Time:', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `${new Date(order.collectionDetails.date).toLocaleDateString('en-ZW')} at ${order.collectionDetails.timeSlot}`,
        60,
        yPosition
      );
    } else {
      doc.setFont('helvetica', 'bold');
      doc.text('Collection Location:', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text('181 Selous Avenue, Harare, Zimbabwe', 60, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'bold');
      doc.text('Collection Date & Time:', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `${new Date(order.collectionDetails.date).toLocaleDateString('en-ZW')} at ${order.collectionDetails.timeSlot}`,
        60,
        yPosition
      );
    }

    yPosition += 15;

    // Items Table
    const tableData = order.items.map(item => [
      item.product.name,
      item.quantity.toString(),
      `$${item.product.price.toFixed(2)}`,
      `$${(item.product.price * item.quantity).toFixed(2)}`
    ]);

    autoTable(doc, {
      head: [['Product', 'Quantity', 'Unit Price', 'Total']],
      body: tableData,
      startY: yPosition,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 91, 130],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 11
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' }
      },
      bodyStyles: {
        fontSize: 10,
        textColor: [51, 51, 51]
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { left: 15, right: 15 }
    });

    // @ts-ignore - autoTable adds finalY
    yPosition = doc.lastAutoTable.finalY + 10;

    // Total Section
    const totalBoxY = yPosition;
    doc.setFillColor(0, 91, 130);
    doc.rect(pageWidth - 75, totalBoxY, 60, 15, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', pageWidth - 70, totalBoxY + 10);
    doc.text(`$${order.total.toFixed(2)}`, pageWidth - 20, totalBoxY + 10, { align: 'right' });

    yPosition = totalBoxY + 25;

    // Footer - Company Contact Information
    const footerY = doc.internal.pageSize.getHeight() - 40;
    doc.setDrawColor(0, 168, 197);
    doc.setLineWidth(0.5);
    doc.line(15, footerY, pageWidth - 15, footerY);

    doc.setFontSize(10);
    doc.setTextColor(0, 91, 130);
    doc.setFont('helvetica', 'bold');
    doc.text('Oasis Water Zimbabwe', pageWidth / 2, footerY + 8, { align: 'center' });

    doc.setFontSize(9);
    doc.setTextColor(102, 102, 102);
    doc.setFont('helvetica', 'normal');
    doc.text('181 Selous Avenue, Harare, Zimbabwe', pageWidth / 2, footerY + 14, { align: 'center' });
    doc.text('Phone: +263 77 000 0000 | Email: info@oasiswater.co.zw', pageWidth / 2, footerY + 19, { align: 'center' });
    doc.text('www.oasiswater.co.zw', pageWidth / 2, footerY + 24, { align: 'center' });

    // Thank you message
    doc.setFontSize(11);
    doc.setTextColor(0, 168, 197);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for your business!', pageWidth / 2, footerY + 32, { align: 'center' });

    // Download the PDF
    doc.save(`Oasis-Invoice-${order.orderNumber}.pdf`);
  }

  private formatPaymentMethod(method: string): string {
    switch (method) {
      case 'cash':
        return 'Cash';
      case 'ecocash':
        return 'EcoCash';
      case 'card':
        return 'Credit/Debit Card';
      default:
        return method;
    }
  }
}
