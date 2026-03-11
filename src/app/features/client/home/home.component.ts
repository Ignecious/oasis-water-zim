import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { Product } from '../../../models/product.interface';
import { TopNavBarComponent } from '../../../shared/top-nav-bar/top-nav-bar.component';
import { StickyHeaderComponent } from '../../../shared/sticky-header/sticky-header.component';
import { FooterNewComponent } from '../../../shared/footer-new/footer-new.component';

interface TargetOption {
  label: string;
  value: 'b2c' | 'b2b';
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CardModule,
    ButtonModule,
    SelectButtonModule,
    TopNavBarComponent,
    StickyHeaderComponent,
    FooterNewComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  featuredProducts: Product[] = [];
  allProducts: Product[] = [];
  selectedTarget: 'b2c' | 'b2b' = 'b2c';
  productTargetOptions: TargetOption[] = [
    { label: 'Home & Individuals', value: 'b2c' },
    { label: 'Office & Bulk', value: 'b2b' }
  ];
  addingToCart: { [key: string]: boolean } = {};
  
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private cartService: CartService
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
        this.allProducts = products;
        this.featuredProducts = products.filter(p => p.featured === true);
      });
  }

  getFilteredProducts(): Product[] {
    if (this.selectedTarget === 'b2c') {
      return this.featuredProducts.filter(p => 
        p.target === 'b2c' || p.target === 'both'
      );
    } else {
      return this.allProducts.filter(p => 
        p.target === 'b2b' || p.target === 'both'
      );
    }
  }

  scrollToProducts(): void {
    const element = document.querySelector('.featured-products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  addToCart(product: Product, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    
    // Visual feedback - button animation
    this.addingToCart[product.id] = true;
    
    this.cartService.addToCart(product, 1);
    
    // Reset button state after animation
    setTimeout(() => {
      this.addingToCart[product.id] = false;
    }, 600);
  }

  isAddingToCart(productId: string): boolean {
    return this.addingToCart[productId] || false;
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

  updateQuantity(productId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const newQuantity = parseInt(input.value, 10);
    
    if (!isNaN(newQuantity) && newQuantity > 0) {
      this.cartService.updateQuantity(productId, newQuantity);
    } else {
      // Reset to current quantity if invalid
      input.value = this.getItemQuantity(productId).toString();
    }
  }

  validateQuantity(productId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const currentQuantity = this.getItemQuantity(productId);
    const newQuantity = parseInt(input.value, 10);
    
    // Ensure valid quantity on blur
    if (isNaN(newQuantity) || newQuantity < 1) {
      input.value = currentQuantity.toString();
    }
  }
}
