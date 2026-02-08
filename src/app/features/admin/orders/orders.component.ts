import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { OrderService } from '../../../services/order.service';
import { Order, OrderStatus, PaymentMethod } from '../../../models/order.interface';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    CheckboxModule,
    ToastModule,
    InputTextModule,
    TagModule
  ],
  providers: [MessageService],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  loading = true;
  displayDialog = false;
  selectedOrder: Order | null = null;
  
  statusOptions = [
    { label: 'All Status', value: null },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Ready', value: 'ready' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' }
  ];

  paymentMethodOptions = [
    { label: 'All Payment Methods', value: null },
    { label: 'EcoCash', value: 'ecocash' },
    { label: 'Cash on Collection', value: 'cash' }
  ];

  orderStatusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Ready', value: 'ready' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' }
  ];

  selectedStatus: OrderStatus | null = null;
  selectedPaymentMethod: PaymentMethod | null = null;
  searchText = '';

  constructor(
    private orderService: OrderService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load orders'
        });
      }
    });
  }

  applyFilters() {
    this.filteredOrders = this.orders.filter(order => {
      const matchesStatus = !this.selectedStatus || order.status === this.selectedStatus;
      const matchesPayment = !this.selectedPaymentMethod || order.paymentMethod === this.selectedPaymentMethod;
      const matchesSearch = !this.searchText || 
        order.orderNumber.toLowerCase().includes(this.searchText.toLowerCase()) ||
        `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase().includes(this.searchText.toLowerCase()) ||
        order.customer.phone.includes(this.searchText);
      
      return matchesStatus && matchesPayment && matchesSearch;
    });
  }

  onFilterChange() {
    this.applyFilters();
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
        this.orderService.updatePaymentStatus(
          this.selectedOrder!.orderNumber,
          this.selectedOrder!.paymentStatus
        ).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Order updated successfully'
            });
            this.loadOrders();
            this.displayDialog = false;
          }
        });
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
}
