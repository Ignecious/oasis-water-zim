import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Order, CustomerDetails, OrderStatus, PaymentMethod } from '../models/order.interface';
import { CartItem } from '../models/cart-item.interface';
import { CollectionDetails } from '../models/collection-slot.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<Order[]>(this.getDemoOrders());
  public orders$ = this.ordersSubject.asObservable();
  private orderCounter = 11;

  constructor() { }

  private getDemoOrders(): Order[] {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return [
      {
        orderNumber: 'OW-2026-001',
        orderDate: new Date(today.getTime() - 2 * 60 * 60 * 1000),
        customer: {
          firstName: 'Tendai',
          lastName: 'Moyo',
          phone: '+263771234567',
          email: 'tendai@example.com'
        },
        items: [
          {
            product: {
              id: 'p5',
              name: 'Oasis Purified Water',
              category: 'water',
              size: '19L',
              price: 8.00,
              image: 'assets/products/oasis-19l.jpg',
              description: 'Bulk water for offices'
            },
            quantity: 3
          }
        ],
        total: 24.00,
        paymentMethod: 'ecocash',
        paymentStatus: 'paid',
        collectionDetails: {
          date: tomorrow,
          timeSlot: '10:00 AM',
          location: 'Oasis Plant, Selous Street, Harare'
        },
        status: 'confirmed',
        ecocashNumber: '+263771234567'
      },
      {
        orderNumber: 'OW-2026-002',
        orderDate: new Date(today.getTime() - 5 * 60 * 60 * 1000),
        customer: {
          firstName: 'Chipo',
          lastName: 'Ndlovu',
          phone: '+263772345678',
          email: 'chipo@example.com'
        },
        items: [
          {
            product: {
              id: 'p7',
              name: 'Pluto Ice Cubes',
              category: 'ice',
              size: '5kg',
              price: 3.50,
              image: 'assets/products/pluto-ice-5kg.jpg',
              description: 'Perfect for events'
            },
            quantity: 4
          }
        ],
        total: 14.00,
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        collectionDetails: {
          date: tomorrow,
          timeSlot: '2:00 PM',
          location: 'Oasis Plant, Selous Street, Harare'
        },
        status: 'pending'
      },
      {
        orderNumber: 'OW-2026-003',
        orderDate: new Date(today.getTime() - 24 * 60 * 60 * 1000),
        customer: {
          firstName: 'Tinashe',
          lastName: 'Mhuru',
          phone: '+263773456789',
          email: 'tinashe@example.com'
        },
        items: [
          {
            product: {
              id: 'p2',
              name: 'Oasis Still Water',
              category: 'water',
              size: '1.5L',
              price: 1.00,
              image: 'assets/products/oasis-1.5l.jpg',
              description: 'Pure refreshing water'
            },
            quantity: 12
          }
        ],
        total: 12.00,
        paymentMethod: 'ecocash',
        paymentStatus: 'paid',
        collectionDetails: {
          date: today,
          timeSlot: '12:00 PM',
          location: 'Oasis Plant, Selous Street, Harare'
        },
        status: 'ready',
        ecocashNumber: '+263773456789'
      },
      {
        orderNumber: 'OW-2026-004',
        orderDate: new Date(today.getTime() - 30 * 60 * 60 * 1000),
        customer: {
          firstName: 'Rumbi',
          lastName: 'Nyoni',
          phone: '+263774567890',
          email: 'rumbi@example.com'
        },
        items: [
          {
            product: {
              id: 'p10',
              name: 'Water Dispenser',
              category: 'dispensers',
              size: 'Hot & Cold',
              price: 45.00,
              image: 'assets/products/dispenser.jpg',
              description: 'Dual temperature dispenser'
            },
            quantity: 1
          }
        ],
        total: 45.00,
        paymentMethod: 'cash',
        paymentStatus: 'paid',
        collectionDetails: {
          date: new Date(today.getTime() - 24 * 60 * 60 * 1000),
          timeSlot: '4:00 PM',
          location: 'Oasis Plant, Selous Street, Harare'
        },
        status: 'completed'
      },
      {
        orderNumber: 'OW-2026-005',
        orderDate: new Date(today.getTime() - 1 * 60 * 60 * 1000),
        customer: {
          firstName: 'Farai',
          lastName: 'Chikwanha',
          phone: '+263775678901',
          email: 'farai@example.com'
        },
        items: [
          {
            product: {
              id: 'p1',
              name: 'Oasis Sport Water',
              category: 'water',
              size: '500ml',
              price: 0.50,
              image: 'assets/products/oasis-sport-500ml.jpg',
              description: 'Perfect for hydration on the go'
            },
            quantity: 24
          }
        ],
        total: 12.00,
        paymentMethod: 'ecocash',
        paymentStatus: 'paid',
        collectionDetails: {
          date: nextWeek,
          timeSlot: '8:00 AM',
          location: 'Oasis Plant, Selous Street, Harare'
        },
        status: 'confirmed',
        ecocashNumber: '+263775678901'
      }
    ];
  }

  getAllOrders(): Observable<Order[]> {
    return of(this.ordersSubject.value).pipe(delay(300));
  }

  getOrderByNumber(orderNumber: string): Observable<Order | undefined> {
    const order = this.ordersSubject.value.find(o => o.orderNumber === orderNumber);
    return of(order).pipe(delay(200));
  }

  createOrder(
    customer: CustomerDetails,
    items: CartItem[],
    paymentMethod: PaymentMethod,
    collectionDetails: CollectionDetails,
    ecocashNumber?: string
  ): Observable<Order> {
    const order: Order = {
      orderNumber: `OW-2026-${String(this.orderCounter++).padStart(3, '0')}`,
      orderDate: new Date(),
      customer,
      items,
      total: items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
      paymentMethod,
      paymentStatus: paymentMethod === 'ecocash' ? 'paid' : 'pending',
      collectionDetails,
      status: 'pending',
      ecocashNumber
    };

    const orders = [...this.ordersSubject.value, order];
    this.ordersSubject.next(orders);
    return of(order).pipe(delay(2000)); // Simulate payment processing
  }

  updateOrderStatus(orderNumber: string, status: OrderStatus): Observable<Order | undefined> {
    const orders = this.ordersSubject.value.map(o =>
      o.orderNumber === orderNumber ? { ...o, status } : o
    );
    this.ordersSubject.next(orders);
    const updatedOrder = orders.find(o => o.orderNumber === orderNumber);
    return of(updatedOrder).pipe(delay(200));
  }

  updatePaymentStatus(orderNumber: string, paymentStatus: 'paid' | 'pending'): Observable<Order | undefined> {
    const orders = this.ordersSubject.value.map(o =>
      o.orderNumber === orderNumber ? { ...o, paymentStatus } : o
    );
    this.ordersSubject.next(orders);
    const updatedOrder = orders.find(o => o.orderNumber === orderNumber);
    return of(updatedOrder).pipe(delay(200));
  }

  getOrdersByDate(date: Date): Observable<Order[]> {
    const orders = this.ordersSubject.value.filter(o => {
      const collectionDate = new Date(o.collectionDetails.date);
      return collectionDate.toDateString() === date.toDateString();
    });
    return of(orders).pipe(delay(300));
  }

  getTodaysOrders(): Observable<Order[]> {
    return this.getOrdersByDate(new Date());
  }

  getOrdersByStatus(status: OrderStatus): Observable<Order[]> {
    const orders = this.ordersSubject.value.filter(o => o.status === status);
    return of(orders).pipe(delay(300));
  }
}
