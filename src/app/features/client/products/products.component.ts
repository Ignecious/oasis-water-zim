import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
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
    CardModule,
    ButtonModule,
    TabViewModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit, OnDestroy {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: string = 'all';
  private destroy$ = new Subject<void>();

  categories = [
    { label: 'All Products', value: 'all' },
    { label: '💧 Bottled Water', value: 'water' },
    { label: '🧊 Ice Products', value: 'ice' },
    { label: '🎒 Accessories', value: 'accessories' }
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

  onTabChange(event: any): void {
    this.selectedCategory = this.categories[event.index].value;
    this.filterProducts();
  }

  filterProducts(): void {
    if (this.selectedCategory === 'all') {
      this.filteredProducts = [...this.allProducts];
    } else {
      this.filteredProducts = this.allProducts.filter(
        product => product.category === this.selectedCategory
      );
    }
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
