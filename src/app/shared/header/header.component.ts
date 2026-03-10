import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { CartService } from '../../services/cart.service';
import { Subject, takeUntil } from 'rxjs';
import { ProfileDrawerComponent } from '../profile-drawer/profile-drawer.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ButtonModule, BadgeModule, ProfileDrawerComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartItemCount = 0;
  isProfileDrawerOpen = false;
  private destroy$ = new Subject<void>();

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
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
