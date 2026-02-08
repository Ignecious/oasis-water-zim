import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { OrderService } from '../../../services/order.service';
import { Order, OrderStatus, PaymentMethod } from '../../../models/order.interface';

interface TimeSlot {
  label: string;
  value: string;
  collections: Order[];
  count: number;
  severity: 'success' | 'warning' | 'danger';
  expanded: boolean;
}

@Component({
  selector: 'app-collection-schedule',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    ButtonModule,
    PanelModule,
    BadgeModule,
    TagModule,
    DialogModule,
    DropdownModule,
    CheckboxModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './collection-schedule.component.html',
  styleUrl: './collection-schedule.component.scss'
})
export class CollectionScheduleComponent implements OnInit {
  selectedDate: Date = new Date();
  timeSlots: TimeSlot[] = [];
  loading = false;
  displayDialog = false;
  selectedOrder: Order | null = null;

  orderStatusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Ready', value: 'ready' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' }
  ];

  private readonly TIME_SLOT_DEFINITIONS = [
    '8:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 2:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM'
  ];

  constructor(
    private orderService: OrderService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadCollections();
  }

  loadCollections() {
    this.loading = true;
    this.orderService.getOrdersByDate(this.selectedDate).subscribe({
      next: (orders) => {
        this.groupOrdersByTimeSlot(orders);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading collections:', error);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load collections'
        });
      }
    });
  }

  groupOrdersByTimeSlot(orders: Order[]) {
    this.timeSlots = this.TIME_SLOT_DEFINITIONS.map(slotLabel => {
      const slotOrders = orders.filter(
        order => order.collectionDetails.timeSlot === slotLabel
      );
      const count = slotOrders.length;
      
      return {
        label: slotLabel,
        value: slotLabel,
        collections: slotOrders,
        count: count,
        severity: this.getSlotSeverity(count),
        expanded: false
      };
    });
  }

  getSlotSeverity(count: number): 'success' | 'warning' | 'danger' {
    if (count < 5) return 'success';
    if (count <= 8) return 'warning';
    return 'danger';
  }

  onDateChange() {
    this.loadCollections();
  }

  previousDay() {
    const newDate = new Date(this.selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    this.selectedDate = newDate;
    this.loadCollections();
  }

  nextDay() {
    const newDate = new Date(this.selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    this.selectedDate = newDate;
    this.loadCollections();
  }

  goToToday() {
    this.selectedDate = new Date();
    this.loadCollections();
  }

  formatSelectedDate(): string {
    return this.selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  toggleSlot(slot: TimeSlot) {
    slot.expanded = !slot.expanded;
  }

  openOrderDetails(order: Order) {
    this.selectedOrder = { ...order };
    this.displayDialog = true;
  }

  updateOrder() {
    if (!this.selectedOrder) return;

    this.orderService.updateOrderStatus(
      this.selectedOrder.orderNumber,
      this.selectedOrder.status
    ).subscribe({
      next: () => {
        if (this.selectedOrder?.paymentMethod === 'cash') {
          this.orderService.updatePaymentStatus(
            this.selectedOrder.orderNumber,
            this.selectedOrder.paymentStatus
          ).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Order updated successfully'
              });
              this.loadCollections();
              this.displayDialog = false;
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update payment status'
              });
            }
          });
        } else {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Order updated successfully'
          });
          this.loadCollections();
          this.displayDialog = false;
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update order'
        });
      }
    });
  }

  getStatusSeverity(status: OrderStatus): 'success' | 'secondary' | 'info' | 'warning' | 'danger' {
    const severityMap: Record<OrderStatus, 'success' | 'secondary' | 'info' | 'warning' | 'danger'> = {
      'pending': 'warning',
      'confirmed': 'info',
      'ready': 'success',
      'completed': 'secondary',
      'cancelled': 'danger'
    };
    return severityMap[status];
  }

  getPaymentMethodLabel(method: PaymentMethod): string {
    return method === 'ecocash' ? 'EcoCash' : 'Cash on Collection';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getLineTotal(quantity: number, unitPrice: number): number {
    return quantity * unitPrice;
  }

  getCustomerName(order: Order): string {
    return `${order.customer.firstName} ${order.customer.lastName}`;
  }

  getItemsSummary(order: Order): string {
    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
    return `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
  }

  getTotalCollections(): number {
    return this.timeSlots.reduce((sum, slot) => sum + slot.count, 0);
  }

  hasCollections(): boolean {
    return this.getTotalCollections() > 0;
  }

  isToday(): boolean {
    return this.selectedDate.toDateString() === new Date().toDateString();
  }
}
