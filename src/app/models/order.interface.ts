import { CartItem } from './cart-item.interface';
import { CollectionDetails } from './collection-slot.interface';
import { Address } from './address.interface';

export type OrderStatus = 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';
export type PaymentMethod = 'ecocash' | 'zipit' | 'card' | 'cash';
export type PaymentStatus = 'paid' | 'pending';
export type FulfillmentType = 'collection' | 'delivery';

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
  fulfillmentType: FulfillmentType;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  collectionDetails: CollectionDetails;
  deliveryAddress?: Address;
  status: OrderStatus;
  ecocashNumber?: string;
}
