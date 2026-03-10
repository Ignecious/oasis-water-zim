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
}
