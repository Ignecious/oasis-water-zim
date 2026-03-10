import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { Product } from '../../../models/product.interface';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    BadgeModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit, OnDestroy {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: string = 'all';
  searchQuery: string = '';
  cartItemCount: number = 0;
  addingToCart: { [key: string]: boolean } = {};
  private destroy$ = new Subject<void>();

  categories = [
    { label: 'All Products', value: 'all' },
    { label: 'Still Water', value: 'water' },
    { label: 'Dispensers', value: 'dispensers' },
    { label: 'Ice', value: 'ice' },
    { label: 'Accessories', value: 'accessories' }
  ];

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.subscribeToCart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    this.productService.getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(products => {
        this.allProducts = products;
        this.filterProducts();
      });
  }

  subscribeToCart(): void {
    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe((items: any[]) => {
        this.cartItemCount = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      });
  }

  selectCategory(categoryValue: string): void {
    this.selectedCategory = categoryValue;
    this.filterProducts();
  }

  onSearchChange(): void {
    this.filterProducts();
  }

  filterProducts(): void {
    let products = [...this.allProducts];

    // Filter by category
    if (this.selectedCategory !== 'all') {
      products = products.filter(product => product.category === this.selectedCategory);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      products = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.size.toLowerCase().includes(query)
      );
    }

    this.filteredProducts = products;
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

  getBestSellerBadge(index: number): boolean {
    // Mark first product as best seller
    return index === 0;
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
