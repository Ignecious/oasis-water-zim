import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
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
    ToastModule,
    HeaderComponent,
    FooterComponent
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
        this.featuredProducts = products.slice(0, 6);
      });
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
}
