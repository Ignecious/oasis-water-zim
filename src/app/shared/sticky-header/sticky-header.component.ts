import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { CartService } from '../../services/cart.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-sticky-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    MenuModule
  ],
  templateUrl: './sticky-header.component.html',
  styleUrl: './sticky-header.component.scss'
})
export class StickyHeaderComponent implements OnInit, OnDestroy {
  @ViewChild('userMenu') userMenu!: Menu;
  
  cartItemCount: number = 0;
  private destroy$ = new Subject<void>();

  userMenuItems: MenuItem[] = [
    {
      label: 'Manage Account',
      icon: 'pi pi-user-edit',
      command: () => {
        this.manageAccount();
      }
    },
    { separator: true },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        this.logout();
      }
    }
  ];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // Subscribe to cart items and calculate count
    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe((items: any[]) => {
        this.cartItemCount = items.reduce((count, item) => count + item.quantity, 0);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleUserMenu(event: Event): void {
    this.userMenu.toggle(event);
  }

  manageAccount(): void {
    console.log('Manage Account clicked');
    // TODO: Navigate to account management page
  }

  logout(): void {
    console.log('Logout clicked');
    // TODO: Clear authentication and redirect to login
  }
}
