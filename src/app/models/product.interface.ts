export interface Product {
  id: string;
  name: string;
  category: 'water' | 'ice' | 'accessories' | 'dispensers';
  target?: 'b2c' | 'b2b' | 'both';  // Customer segment targeting
  size: string;
  price: number;
  image: string;
  description: string;
  stock?: number;
  featured?: boolean;
  minOrderQty?: number;  // Minimum order quantity
  qtyIncrement?: number;  // Quantity must be in increments of this value
  unitType?: string;  // Descriptive unit type (e.g., "6-pack", "case", "unit")
}
