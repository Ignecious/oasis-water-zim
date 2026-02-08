import { CartItem } from './cart-item.interface';
import { CollectionDetails } from './collection-slot.interface';

export type OrderStatus = 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';
export type PaymentMethod = 'ecocash' | 'cash';
export type PaymentStatus = 'paid' | 'pending';

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface Order {
  orderNumber: string;
  orderDate: Date;
  customer: CustomerDetails;
  items: CartItem[];
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  collectionDetails: CollectionDetails;
  status: OrderStatus;
  ecocashNumber?: string;
}
