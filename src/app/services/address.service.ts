import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Address } from '../models/address.interface';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private addressesSubject = new BehaviorSubject<Address[]>([
    {
      id: '1',
      type: 'home',
      street: '15 Borrowdale Road',
      suburb: 'Borrowdale',
      city: 'Harare',
      isDefault: true,
      label: 'Home'
    },
    {
      id: '2',
      type: 'office',
      street: '42 Samora Machel Avenue',
      suburb: 'CBD',
      city: 'Harare',
      isDefault: false,
      label: 'Office'
    }
  ]);

  addresses$ = this.addressesSubject.asObservable();

  getAddresses(): Observable<Address[]> {
    return this.addresses$;
  }

  getDefaultAddress(): Address | undefined {
    return this.addressesSubject.value.find(addr => addr.isDefault);
  }

  addAddress(address: Address): void {
    const currentAddresses = this.addressesSubject.value;
    // If this is set as default, unset others
    if (address.isDefault) {
      currentAddresses.forEach(addr => addr.isDefault = false);
    }
    this.addressesSubject.next([...currentAddresses, address]);
  }

  setDefaultAddress(addressId: string): void {
    const addresses = this.addressesSubject.value.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    this.addressesSubject.next(addresses);
  }

  deleteAddress(addressId: string): void {
    const addresses = this.addressesSubject.value.filter(addr => addr.id !== addressId);
    this.addressesSubject.next(addresses);
  }
}
