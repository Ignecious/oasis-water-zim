import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/client/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./features/client/products/products.component').then(m => m.ProductsComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/client/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/client/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'order-status',
    loadComponent: () => import('./features/client/order-status/order-status.component').then(m => m.OrderStatusComponent)
  },
  {
    path: 'order-status/:orderNumber',
    loadComponent: () => import('./features/client/order-status/order-status.component').then(m => m.OrderStatusComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./features/admin/products/products.component').then(m => m.ProductsComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/admin/orders/orders.component').then(m => m.OrdersComponent)
      },
      {
        path: 'collection-schedule',
        loadComponent: () => import('./features/admin/collection-schedule/collection-schedule.component').then(m => m.CollectionScheduleComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
