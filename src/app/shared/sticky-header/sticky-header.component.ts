import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CartService } from '../../services/cart.service';
import { Subject, takeUntil } from 'rxjs';
import { ProfileDrawerComponent } from '../profile-drawer/profile-drawer.component';

@Component({
  selector: 'app-sticky-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    ProfileDrawerComponent
  ],
  templateUrl: './sticky-header.component.html',
  styleUrl: './sticky-header.component.scss'
})
export class StickyHeaderComponent implements OnInit, OnDestroy {
  cartItemCount: number = 0;
  isProfileDrawerOpen: boolean = false;
  private destroy$ = new Subject<void>();

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

  toggleProfileDrawer(): void {
    this.isProfileDrawerOpen = !this.isProfileDrawerOpen;
  }

  closeProfileDrawer(): void {
    this.isProfileDrawerOpen = false;
  }
}
