import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: '📊', route: '/admin/dashboard' },
    { label: 'Products', icon: '📦', route: '/admin/products' },
    { label: 'Orders', icon: '📋', route: '/admin/orders' },
    { label: 'Schedule', icon: '📅', route: '/admin/collection-schedule' }
  ];

  constructor(private router: Router) {}

  navigateToClient() {
    this.router.navigate(['/']);
  }
}
