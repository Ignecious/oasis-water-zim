import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrderService } from './order.service';
import { ProductService } from './product.service';

export interface DashboardStats {
  ordersToday: number;
  revenueThisWeek: number;
  pendingCollections: number;
  totalProducts: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private orderService: OrderService,
    private productService: ProductService
  ) { }

  getStats(): Observable<DashboardStats> {
    return combineLatest([
      this.orderService.getAllOrders(),
      this.productService.getAllProducts()
    ]).pipe(
      map(([orders, products]) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        weekAgo.setHours(0, 0, 0, 0);

        // Orders placed today
        const ordersToday = orders.filter(o => {
          const orderDate = new Date(o.orderDate);
          orderDate.setHours(0, 0, 0, 0);
          return orderDate.getTime() === today.getTime();
        }).length;

        // Revenue from orders placed this week
        const revenueThisWeek = orders
          .filter(o => new Date(o.orderDate) >= weekAgo)
          .reduce((sum, o) => sum + o.total, 0);

        // Pending collections (Pending or Confirmed status)
        const pendingCollections = orders.filter(o => 
          o.status === 'pending' || o.status === 'confirmed'
        ).length;

        // Total products
        const totalProducts = products.length;

        return {
          ordersToday,
          revenueThisWeek,
          pendingCollections,
          totalProducts
        };
      })
    );
  }

  getRecentOrders(count: number = 10): Observable<any[]> {
    return this.orderService.getAllOrders().pipe(
      map(orders => {
        // Sort by order date descending
        return orders
          .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
          .slice(0, count);
      })
    );
  }
}
