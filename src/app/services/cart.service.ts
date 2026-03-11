import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item.interface';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    // One-time cleanup of old localStorage data
    localStorage.removeItem('oasis_cart');
    // Always start with empty cart - no localStorage persistence
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(item => item.product.id === product.id);

    let updatedItems: CartItem[];
    if (existingItem) {
      updatedItems = currentItems.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedItems = [...currentItems, { product, quantity }];
    }

    this.cartItemsSubject.next(updatedItems);
    // No localStorage - fresh cart on every page load
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const updatedItems = this.cartItemsSubject.value.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );

    this.cartItemsSubject.next(updatedItems);
    // No localStorage - fresh cart on every page load
  }

  removeFromCart(productId: string): void {
    const updatedItems = this.cartItemsSubject.value.filter(
      item => item.product.id !== productId
    );

    this.cartItemsSubject.next(updatedItems);
    // No localStorage - fresh cart on every page load
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    // No localStorage cleanup needed
  }

  getCartTotal(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + (item.product.price * item.quantity),
      0
    );
  }

  getCartItemCount(): number {
    return this.cartItemsSubject.value.reduce(
      (count, item) => count + item.quantity,
      0
    );
  }

  getItemQuantity(productId: string): number {
    const item = this.cartItemsSubject.value.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }

  increaseQuantity(productId: string): void {
    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.find(item => item.product.id === productId);
    if (item) {
      const updatedItems = currentItems.map(cartItem =>
        cartItem.product.id === productId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      this.cartItemsSubject.next(updatedItems);
      // No localStorage - fresh cart on every page load
    }
  }

  decreaseQuantity(productId: string): void {
    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.find(item => item.product.id === productId);
    if (item) {
      if (item.quantity > 1) {
        const updatedItems = currentItems.map(cartItem =>
          cartItem.product.id === productId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
        this.cartItemsSubject.next(updatedItems);
        // No localStorage - fresh cart on every page load
      } else {
        // Remove item if quantity reaches 0
        this.removeFromCart(productId);
      }
    }
  }

  /**
   * Validates if the quantity meets the product's minimum order requirements
   * @param product The product to validate
   * @param quantity The quantity to validate
   * @returns Object with isValid flag and error message if invalid
   */
  validateMinimumQuantity(product: Product, quantity: number): { isValid: boolean; message?: string } {
    // If no MOQ configured, any positive quantity is valid
    if (!product.minOrderQty) {
      return { isValid: quantity > 0 };
    }

    // Check minimum quantity
    if (quantity < product.minOrderQty) {
      const unitLabel = product.unitType || 'units';
      return {
        isValid: false,
        message: `Minimum order is ${product.minOrderQty} cases (${unitLabel})`
      };
    }

    // Check increment requirement
    if (product.qtyIncrement && quantity % product.qtyIncrement !== 0) {
      const unitLabel = product.unitType || 'units';
      const nextValid1 = Math.ceil(quantity / product.qtyIncrement) * product.qtyIncrement;
      const nextValid2 = nextValid1 + product.qtyIncrement;
      const nextValid3 = nextValid2 + product.qtyIncrement;
      
      return {
        isValid: false,
        message: `Must be in multiples of ${product.qtyIncrement} cases (${unitLabel}). Try ${nextValid1} cases, ${nextValid2} cases, ${nextValid3} cases`
      };
    }

    return { isValid: true };
  }

  /**
   * Gets the next valid quantity for a product based on MOQ rules
   * @param product The product
   * @param currentQuantity Current quantity
   * @param direction 'up' or 'down'
   * @returns Next valid quantity
   */
  getNextValidQuantity(product: Product, currentQuantity: number, direction: 'up' | 'down'): number {
    const increment = product.qtyIncrement || 1;
    const minQty = product.minOrderQty || 1;

    if (direction === 'up') {
      return currentQuantity + increment;
    } else {
      const nextQty = currentQuantity - increment;
      return nextQty < minQty ? minQty : nextQty;
    }
  }
}
