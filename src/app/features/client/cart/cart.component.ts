import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../../services/cart.service';
import { CartItem } from '../../../models/cart-item.interface';

interface TimeSlot {
  label: string;
  value: string;
}

interface OrderConfirmation {
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  collectionDate: Date;
  collectionTime: string;
  paymentMethod: string;
  total: number;
  items: CartItem[];
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    DialogModule,
    CalendarModule,
    DropdownModule,
    RadioButtonModule,
    InputTextModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  showCheckoutDialog: boolean = false;
  showConfirmationDialog: boolean = false;
  checkoutForm!: FormGroup;
  orderConfirmation: OrderConfirmation | null = null;
  isProcessingPayment: boolean = false;
  
  private destroy$ = new Subject<void>();

  timeSlots: TimeSlot[] = [
    { label: '8:00 AM - 10:00 AM', value: '8:00 AM - 10:00 AM' },
    { label: '10:00 AM - 12:00 PM', value: '10:00 AM - 12:00 PM' },
    { label: '12:00 PM - 2:00 PM', value: '12:00 PM - 2:00 PM' },
    { label: '2:00 PM - 4:00 PM', value: '2:00 PM - 4:00 PM' },
    { label: '4:00 PM - 5:00 PM', value: '4:00 PM - 5:00 PM' }
  ];

  collectionAddress: string = '181 Selous Avenue, Harare, Zimbabwe';
  minDate: Date = new Date();

  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadCart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.checkoutForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      collectionDate: [null, Validators.required],
      collectionTime: ['', Validators.required],
      paymentMethod: ['', Validators.required]
    });
  }

  private loadCart(): void {
    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.cartItems = items;
        this.calculateSubtotal();
      });
  }

  private calculateSubtotal(): void {
    this.subtotal = this.cartService.getCartTotal();
  }

  increaseQuantity(productId: string): void {
    this.cartService.increaseQuantity(productId);
  }

  decreaseQuantity(productId: string): void {
    this.cartService.decreaseQuantity(productId);
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
    this.messageService.add({
      severity: 'info',
      summary: 'Item Removed',
      detail: 'Item has been removed from your cart'
    });
  }

  getLineTotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }

  openCheckoutDialog(): void {
    this.showCheckoutDialog = true;
  }

  closeCheckoutDialog(): void {
    this.showCheckoutDialog = false;
    this.checkoutForm.reset();
  }

  isWeekday(date: Date): boolean {
    const day = date.getDay();
    return day >= 1 && day <= 6; // Monday to Saturday
  }

  onConfirmOrder(): void {
    if (this.checkoutForm.valid) {
      this.isProcessingPayment = true;

      // Mock payment processing delay
      setTimeout(() => {
        const formValue = this.checkoutForm.value;
        const orderNumber = this.generateOrderNumber();

        this.orderConfirmation = {
          orderNumber,
          customerName: formValue.name,
          email: formValue.email,
          phone: formValue.phone,
          collectionDate: formValue.collectionDate,
          collectionTime: formValue.collectionTime,
          paymentMethod: formValue.paymentMethod === 'ecocash' ? 'EcoCash' : 'Cash on Collection',
          total: this.subtotal,
          items: [...this.cartItems]
        };

        this.isProcessingPayment = false;
        this.showCheckoutDialog = false;
        this.showConfirmationDialog = true;

        // Clear cart
        this.cartService.clearCart();

        this.messageService.add({
          severity: 'success',
          summary: 'Order Confirmed',
          detail: `Your order ${orderNumber} has been confirmed!`
        });
      }, 1500);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.checkoutForm.controls).forEach(key => {
        this.checkoutForm.get(key)?.markAsTouched();
      });

      this.messageService.add({
        severity: 'error',
        summary: 'Form Error',
        detail: 'Please fill in all required fields correctly'
      });
    }
  }

  private generateOrderNumber(): string {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `#OW-${randomNum}`;
  }

  closeConfirmationDialog(): void {
    this.showConfirmationDialog = false;
    this.router.navigate(['/products']);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(date).toLocaleDateString('en-US', options);
  }

  get isFormValid(): boolean {
    return this.checkoutForm.valid;
  }

  get hasCartItems(): boolean {
    return this.cartItems.length > 0;
  }
}
