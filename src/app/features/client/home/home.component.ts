import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { Product } from '../../../models/product.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  featuredProducts: Product[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadFeaturedProducts(): void {
    this.productService.getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(products => {
        this.featuredProducts = products.slice(0, 3);
      });
  }

  getProductImage(index: number): string {
    const images = [
      '/assets/stitch-images/product-sport-500ml.jpg',
      '/assets/stitch-images/product-still-5l.jpg',
      '/assets/stitch-images/product-ice-2kg.jpg'
    ];
    return images[index % 3];
  }

  getProductBadgeText(index: number): string {
    const badges = ['Popular', 'Best Value', 'Premium'];
    return badges[index % 3];
  }

  getProductBadgeClass(index: number): string {
    const classes = ['badge-popular', 'badge-value', 'badge-premium'];
    return classes[index % 3];
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    this.messageService.add({
      severity: 'success',
      summary: 'Added to Cart',
      detail: `${product.name} (${product.size}) has been added to your cart`,
      life: 3000
    });
  }

  increaseQuantity(productId: string): void {
    this.cartService.increaseQuantity(productId);
  }

  decreaseQuantity(productId: string): void {
    this.cartService.decreaseQuantity(productId);
  }

  getItemQuantity(productId: string): number {
    return this.cartService.getItemQuantity(productId);
  }
}
