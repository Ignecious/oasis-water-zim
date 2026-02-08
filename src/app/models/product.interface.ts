export interface Product {
  id: string;
  name: string;
  category: 'water' | 'ice' | 'accessories' | 'dispensers';
  size: string;
  price: number;
  image: string;
  description: string;
  stock?: number;
  featured?: boolean;
}
