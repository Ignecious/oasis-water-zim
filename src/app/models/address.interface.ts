export type AddressType = 'home' | 'office' | 'other';

export interface Address {
  id: string;
  type: AddressType;
  street: string;
  suburb: string;
  city: string;
  isDefault: boolean;
  label?: string; // e.g., "Home", "Office"
}
