import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { Product } from '../../../models/product.interface';
import { TopNavBarComponent } from '../../../shared/top-nav-bar/top-nav-bar.component';
import { StickyHeaderComponent } from '../../../shared/sticky-header/sticky-header.component';
import { FooterNewComponent } from '../../../shared/footer-new/footer-new.component';

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
    BadgeModule,
    ToastModule,
    TopNavBarComponent,
    StickyHeaderComponent,
    FooterNewComponent
  ],
  providers: [MessageService],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit, OnDestroy {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: string = 'all';
  searchQuery: string = '';
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
    private cartService: CartService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
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
    
    // Check MOQ validation
    const initialQty = product.minOrderQty || 1;
    const validation = this.cartService.validateMinimumQuantity(product, initialQty);
    
    if (!validation.isValid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Minimum Order Not Met',
        detail: validation.message,
        life: 3000
      });
      return;
    }
    
    // Visual feedback - button animation
    this.addingToCart[product.id] = true;
    
    this.cartService.addToCart(product, initialQty);
    
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

  updateQuantity(productId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const newQuantity = parseInt(input.value, 10);
    const product = this.allProducts.find(p => p.id === productId);
    
    if (!product) return;
    
    if (!isNaN(newQuantity) && newQuantity > 0) {
      const validation = this.cartService.validateMinimumQuantity(product, newQuantity);
      
      if (validation.isValid) {
        this.cartService.updateQuantity(productId, newQuantity);
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Invalid Quantity',
          detail: validation.message,
          life: 3000
        });
        // Reset to current quantity if invalid
        input.value = this.getItemQuantity(productId).toString();
      }
    } else {
      // Reset to current quantity if invalid
      input.value = this.getItemQuantity(productId).toString();
    }
  }

  validateQuantity(productId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const currentQuantity = this.getItemQuantity(productId);
    const newQuantity = parseInt(input.value, 10);
    const product = this.allProducts.find(p => p.id === productId);
    
    if (!product) return;
    
    // Ensure valid quantity on blur
    if (isNaN(newQuantity) || newQuantity < 1) {
      input.value = currentQuantity.toString();
      return;
    }
    
    // Validate against MOQ rules
    const validation = this.cartService.validateMinimumQuantity(product, newQuantity);
    if (!validation.isValid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Quantity',
        detail: validation.message,
        life: 3000
      });
      input.value = currentQuantity.toString();
    }
  }

  /**
   * Get MOQ helper text for a product
   */
  getMOQText(product: Product): string {
    if (!product.minOrderQty) {
      return '';
    }
    
    const unitLabel = product.unitType || 'units';
    if (product.qtyIncrement && product.qtyIncrement > 1) {
      return `Sold in ${unitLabel} (min: ${product.minOrderQty})`;
    }
    return `Minimum order: ${product.minOrderQty} ${unitLabel}`;
  }

  /**
   * Get the minimum value for quantity input
   */
  getMinQuantity(product: Product): number {
    return product.minOrderQty || 1;
  }

  /**
   * Get the step value for quantity input
   */
  getQuantityStep(product: Product): number {
    return product.qtyIncrement || 1;
  }
}
