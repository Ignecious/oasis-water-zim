import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../../models/order.interface';
import { OrderService } from '../../../services/order.service';
import { PdfInvoiceService } from '../../../services/pdf-invoice.service';
import { TopNavBarComponent } from '../../../shared/top-nav-bar/top-nav-bar.component';
import { StickyHeaderComponent } from '../../../shared/sticky-header/sticky-header.component';
import { FooterNewComponent } from '../../../shared/footer-new/footer-new.component';

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [
    CommonModule,
    TopNavBarComponent,
    StickyHeaderComponent,
    FooterNewComponent
  ],
  templateUrl: './order-status.component.html',
  styleUrl: './order-status.component.scss'
})
export class OrderStatusComponent implements OnInit {
  order: Order | null = null;
  loading = true;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private pdfService: PdfInvoiceService
  ) {}

  ngOnInit(): void {
    const orderNumber = this.route.snapshot.paramMap.get('orderNumber');
    
    if (orderNumber) {
      this.loadOrder(orderNumber);
    } else {
      this.notFound = true;
      this.loading = false;
    }
  }

  private loadOrder(orderNumber: string): void {
    this.orderService.getOrderByNumber(orderNumber).subscribe({
      next: (order) => {
        if (order) {
          this.order = order;
          this.loading = false;
        } else {
          this.notFound = true;
          this.loading = false;
        }
      },
      error: () => {
        this.notFound = true;
        this.loading = false;
      }
    });
  }

  downloadInvoice(): void {
    if (this.order) {
      this.pdfService.generateInvoice(this.order);
    }
  }

  get fulfillmentDate(): string {
    if (!this.order) return '';
    return new Date(this.order.collectionDetails.date).toLocaleDateString('en-ZW', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  get fulfillmentTime(): string {
    if (!this.order) return '';
    return this.order.collectionDetails.timeSlot;
  }

  get paymentMethodLabel(): string {
    if (!this.order) return '';
    switch (this.order.paymentMethod) {
      case 'cash':
        return this.order.fulfillmentType === 'delivery' 
          ? 'Cash on Delivery' 
          : 'Cash on Collection';
      case 'ecocash':
        return 'EcoCash';
      case 'card':
        return 'Credit/Debit Card';
      default:
        return this.order.paymentMethod;
    }
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  viewOrders(): void {
    this.router.navigate(['/orders']);
  }
}
