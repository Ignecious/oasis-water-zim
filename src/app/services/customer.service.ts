import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Customer } from '../models/customer.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private currentCustomer: Customer = {
    id: '1',
    name: 'Tinashe Shumba',
    phone: '+263 77 123 4567',
    email: 'tinashe.shumba@example.com',
    isVerified: true
  };

  getCurrentCustomer(): Observable<Customer> {
    return of(this.currentCustomer);
  }

  getCustomer(): Customer {
    return this.currentCustomer;
  }
}
