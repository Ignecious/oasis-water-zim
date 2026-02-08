import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { DashboardService, DashboardStats } from '../../../services/dashboard.service';
import { Order } from '../../../models/order.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, TableModule, ButtonModule, BadgeModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    ordersToday: 0,
    revenueThisWeek: 0,
    pendingCollections: 0,
    totalProducts: 0
  };
  recentOrders: Order[] = [];
  loading = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadStats();
    this.loadRecentOrders();
  }

  loadStats() {
    this.dashboardService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => console.error('Error loading stats:', error)
    });
  }

  loadRecentOrders() {
    this.dashboardService.getRecentOrders(10).subscribe({
      next: (orders) => {
        this.recentOrders = orders;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading recent orders:', error);
        this.loading = false;
      }
    });
  }

  getCustomerName(order: Order): string {
    return `${order.customer.firstName} ${order.customer.lastName}`;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatusSeverity(status: string): string {
    const severityMap: { [key: string]: string } = {
      'pending': 'warning',
      'confirmed': 'info',
      'ready': 'success',
      'completed': 'secondary',
      'cancelled': 'danger'
    };
    return severityMap[status] || 'secondary';
  }
}
