import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';

import { CartService } from '../../../services/cart.service';
import { AddressService } from '../../../services/address.service';
import { CustomerService } from '../../../services/customer.service';
import { OrderService } from '../../../services/order.service';
import { FulfillmentType, PaymentMethod } from '../../../models/order.interface';
import { Address } from '../../../models/address.interface';
import { Customer } from '../../../models/customer.interface';
import { CartItem } from '../../../models/cart-item.interface';
import { TopNavBarComponent } from '../../../shared/top-nav-bar/top-nav-bar.component';
import { StickyHeaderComponent } from '../../../shared/sticky-header/sticky-header.component';

interface FulfillmentOption {
  label: string;
  value: FulfillmentType;
}

interface DateChip {
  date: Date;
  dayName: string;
  dayNumber: string;
  monthName: string;
  isSelected: boolean;
}

interface TimeSlot {
  id: string;
  label: string;
  time: string;
  isSelected: boolean;
}

interface PaymentMethodOption {
  id: PaymentMethod;
  title: string;
  subtitle: string;
  icon: string;
  isOnline: boolean;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    SelectButtonModule,
    DialogModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    CardModule,
    DividerModule,
    TopNavBarComponent,
    StickyHeaderComponent
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  // Collection address constant
  readonly COLLECTION_ADDRESS = {
    street: '181 Selous Avenue',
    suburb: 'Harare',
    city: 'Zimbabwe'
  };

  // Component state
  fulfillmentOptions: FulfillmentOption[] = [
    { label: 'Collection', value: 'collection' },
    { label: 'Delivery', value: 'delivery' }
  ];
  
  selectedFulfillment: FulfillmentType = 'collection';
  customer: Customer | null = null;
  addresses: Address[] = [];
  selectedAddress: Address | null = null;
  cartItems: CartItem[] = [];
  
  // Date and time selection
  dateChips: DateChip[] = [];
  selectedDate: DateChip | null = null;
  timeSlots: TimeSlot[] = [];
  selectedTimeSlot: TimeSlot | null = null;
  
  // Payment
  paymentMethods: PaymentMethodOption[] = [
    { 
      id: 'ecocash', 
      title: 'EcoCash', 
      subtitle: 'Mobile Money', 
      icon: 'pi-mobile',
      isOnline: true
    },
    { 
      id: 'zipit', 
      title: 'ZIPIT', 
      subtitle: 'Bank Transfer', 
      icon: 'pi-building',
      isOnline: true
    },
    { 
      id: 'card', 
      title: 'Card/Zimswitch', 
      subtitle: 'Debit/Credit Card', 
      icon: 'pi-credit-card',
      isOnline: true
    },
    { 
      id: 'cash', 
      title: 'Cash on Delivery', 
      subtitle: 'Pay when you receive', 
      icon: 'pi-wallet',
      isOnline: false
    }
  ];
  selectedPaymentMethod: PaymentMethod | null = null;
  
  // Add address modal
  showAddAddressModal = false;
  newAddress = {
    street: '',
    suburb: '',
    city: 'Harare',
    type: 'home' as const,
    isDefault: false
  };

  constructor(
    private cartService: CartService,
    private addressService: AddressService,
    private customerService: CustomerService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCustomer();
    this.loadAddresses();
    this.loadCart();
    this.generateDateChips();
    this.generateTimeSlots();
  }

  private loadCustomer(): void {
    this.customerService.getCurrentCustomer().subscribe(customer => {
      this.customer = customer;
    });
  }

  private loadAddresses(): void {
    this.addressService.getAddresses().subscribe(addresses => {
      this.addresses = addresses;
      this.selectedAddress = addresses.find(addr => addr.isDefault) || addresses[0] || null;
    });
  }

  private loadCart(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  private generateDateChips(): void {
    const today = new Date();
    this.dateChips = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      return {
        date,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate().toString(),
        monthName: date.toLocaleDateString('en-US', { month: 'short' }),
        isSelected: i === 0
      };
    });
    this.selectedDate = this.dateChips[0];
  }

  private generateTimeSlots(): void {
    this.timeSlots = [
      { id: '1', label: 'Morning', time: '8:00 AM - 12:00 PM', isSelected: false },
      { id: '2', label: 'Afternoon', time: '12:00 PM - 4:00 PM', isSelected: false },
      { id: '3', label: 'Evening', time: '4:00 PM - 8:00 PM', isSelected: false }
    ];
  }

  onFulfillmentChange(value: FulfillmentType): void {
    this.selectedFulfillment = value;
    if (value === 'delivery' && !this.selectedAddress) {
      this.selectedAddress = this.addresses.find(addr => addr.isDefault) || this.addresses[0] || null;
    }
  }

  selectAddress(address: Address): void {
    this.selectedAddress = address;
  }

  selectDate(chip: DateChip): void {
    this.dateChips.forEach(c => c.isSelected = false);
    chip.isSelected = true;
    this.selectedDate = chip;
  }

  selectTimeSlot(slot: TimeSlot): void {
    this.timeSlots.forEach(s => s.isSelected = false);
    slot.isSelected = true;
    this.selectedTimeSlot = slot;
  }

  selectPaymentMethod(method: PaymentMethod): void {
    this.selectedPaymentMethod = method;
  }

  openAddAddressModal(): void {
    this.showAddAddressModal = true;
  }

  closeAddAddressModal(): void {
    this.showAddAddressModal = false;
    this.resetNewAddress();
  }

  saveNewAddress(): void {
    const address: Address = {
      id: Date.now().toString(),
      type: this.newAddress.type,
      street: this.newAddress.street,
      suburb: this.newAddress.suburb,
      city: this.newAddress.city,
      isDefault: this.newAddress.isDefault,
      label: this.newAddress.type.charAt(0).toUpperCase() + this.newAddress.type.slice(1)
    };
    
    this.addressService.addAddress(address);
    
    if (this.newAddress.isDefault) {
      this.selectedAddress = address;
    }
    
    this.closeAddAddressModal();
  }

  private resetNewAddress(): void {
    this.newAddress = {
      street: '',
      suburb: '',
      city: 'Harare',
      type: 'home',
      isDefault: false
    };
  }

  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  getButtonText(): string {
    if (!this.selectedPaymentMethod) {
      return 'Select Payment Method';
    }
    return this.selectedPaymentMethod === 'cash' 
      ? 'Confirm COD Order' 
      : 'Proceed to Secure Payment';
  }

  isCheckoutValid(): boolean {
    return !!(
      this.selectedFulfillment &&
      this.selectedDate &&
      this.selectedTimeSlot &&
      this.selectedPaymentMethod &&
      (this.selectedFulfillment === 'collection' || this.selectedAddress) &&
      this.cartItems.length > 0
    );
  }

  proceedToCheckout(): void {
    if (!this.isCheckoutValid()) {
      return;
    }

    // TODO: Implement actual checkout logic
    // For COD: Create order immediately
    // For online payment: Redirect to payment gateway
    
    if (this.selectedPaymentMethod === 'cash') {
      console.log('Creating COD order...');
      // this.orderService.createOrder(...)
    } else {
      console.log('Redirecting to payment gateway...');
      // Redirect to payment gateway
    }
  }
}
