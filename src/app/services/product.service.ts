import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>(this.getDemoProducts());
  public products$ = this.productsSubject.asObservable();

  constructor() { }

  private getDemoProducts(): Product[] {
    return [
      // Bottled Water - Consumer (B2C)
      { 
        id: 'p1', 
        name: 'Oasis Sport Water', 
        category: 'water', 
        target: 'b2c',
        size: '750ml', 
        price: 0.85, 
        image: 'assets/stitch-images/product-sport-500ml.jpg', 
        description: 'Perfect for the gym and active lifestyles. Refreshing purified water on the go.',
        stock: 100,
        featured: true
      },
      { 
        id: 'p2', 
        name: 'Oasis Mineral Water', 
        category: 'water', 
        target: 'b2c',
        size: '2L', 
        price: 1.20, 
        image: 'assets/stitch-images/product-still-5l.jpg', 
        description: 'Pure mineral water for everyday hydration. Available at major retailers.',
        stock: 150,
        featured: true
      },
      { 
        id: 'p3', 
        name: 'Oasis Still Water', 
        category: 'water', 
        target: 'b2c',
        size: '5L', 
        price: 2.50, 
        image: 'assets/stitch-images/product-still-5l.jpg', 
        description: 'Weekly family hydration essential. Great value for daily needs.',
        stock: 80,
        featured: true
      },
      
      // Bulk Water - Office & Commercial (B2B)
      { 
        id: 'p4', 
        name: 'Dispenser Bottle', 
        category: 'dispensers', 
        target: 'b2b',
        size: '18.9L', 
        price: 8.00, 
        image: 'assets/stitch-images/product-still-5l.jpg', 
        description: 'Standard dispenser bottle for offices and commercial use. Fits all standard dispensers.',
        stock: 50,
        featured: false
      },
      { 
        id: 'p5', 
        name: 'Dispenser Bottle with Tap', 
        category: 'dispensers', 
        target: 'b2b',
        size: '20L', 
        price: 10.00, 
        image: 'assets/stitch-images/product-still-5l.jpg', 
        description: 'Convenient tap-equipped container perfect for events and functions.',
        stock: 40,
        featured: false
      },
      
      // Ice Products - Available for both B2C and B2B
      { 
        id: 'p6', 
        name: 'Pluto Ice Cubes', 
        category: 'ice', 
        target: 'both',
        size: '2kg', 
        price: 1.20, 
        image: 'assets/stitch-images/product-ice-2kg.jpg', 
        description: 'Crystal clear, slow-melting ice cubes made from purified water.',
        stock: 120,
        featured: true
      },
      { 
        id: 'p7', 
        name: 'Pluto Ice Cubes', 
        category: 'ice', 
        target: 'both',
        size: '5kg', 
        price: 3.50, 
        image: 'assets/stitch-images/product-ice-2kg.jpg', 
        description: 'Perfect for events and parties. High-quality crystal clear ice.',
        stock: 90,
        featured: false
      },
      { 
        id: 'p8', 
        name: 'Pluto Ice Cubes', 
        category: 'ice', 
        target: 'both',
        size: '8kg', 
        price: 5.00, 
        image: 'assets/stitch-images/product-ice-2kg.jpg', 
        description: 'Bulk ice for parties and large gatherings. Premium quality.',
        stock: 70,
        featured: false
      },
      { 
        id: 'p9', 
        name: 'Pluto Ice Blocks', 
        category: 'ice', 
        target: 'both',
        size: '5kg', 
        price: 4.00, 
        image: 'assets/stitch-images/product-ice-2kg.jpg', 
        description: 'Large ice blocks for extended cooling. Ideal for coolers and events.',
        stock: 85,
        featured: false
      },
      { 
        id: 'p10', 
        name: 'Pluto Ice Blocks', 
        category: 'ice', 
        target: 'both',
        size: '10kg', 
        price: 7.50, 
        image: 'assets/stitch-images/product-ice-2kg.jpg', 
        description: 'Extra large ice blocks for commercial use and major events.',
        stock: 65,
        featured: false
      },
      
      // Dispensers & Equipment - Commercial (B2B)
      { 
        id: 'p11', 
        name: 'Water Dispenser', 
        category: 'dispensers', 
        target: 'b2b',
        size: 'Hot  & Cold', 
        price: 45.00, 
        image: 'assets/stitch-images/product-still-5l.jpg', 
        description: 'Dual temperature dispenser for offices. Hot and cold water on demand.',
        stock: 25,
        featured: false
      },
      { 
        id: 'p12', 
        name: 'Pump Dispenser', 
        category: 'dispensers', 
        target: 'both',
        size: 'Manual', 
        price: 8.00, 
        image: 'assets/stitch-images/product-ice-2kg.jpg', 
        description: 'Manual pump dispenser for 18.9L bottles. No electricity required.',
        stock: 55,
        featured: false
      },
      
      // Accessories - Consumer and Business
      { 
        id: 'p13', 
        name: 'Keep Bag Cooler', 
        category: 'accessories', 
        target: 'both',
        size: 'Standard', 
        price: 10.00, 
        image: 'assets/stitch-images/product-sport-500ml.jpg', 
        description: 'Insulated cooler bag to keep beverages cold. Durable and portable.',
        stock: 40,
        featured: false
      },
      { 
        id: 'p14', 
        name: 'Ice Bucket', 
        category: 'accessories', 
        target: 'both',
        size: '5L Capacity', 
        price: 12.00, 
        image: 'assets/stitch-images/product-ice-2kg.jpg', 
        description: 'Insulated ice bucket with lid. Keeps ice frozen for hours.',
        stock: 35,
        featured: false
      },
      { 
        id: 'p15', 
        name: 'Water Bottle Set', 
        category: 'accessories', 
        target: 'b2c',
        size: '6x 750ml', 
        price: 15.00, 
        image: 'assets/stitch-images/product-sport-500ml.jpg', 
        description: 'Set of 6 reusable water bottles. Perfect for families.',
        stock: 30,
        featured: false
      }
    ];
  }

  getAllProducts(): Observable<Product[]> {
    return of(this.productsSubject.value).pipe(delay(300));
  }

  getProductById(id: string): Observable<Product | undefined> {
    const product = this.productsSubject.value.find(p => p.id === id);
    return of(product).pipe(delay(200));
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    if (category === 'all') {
      return this.getAllProducts();
    }
    const products = this.productsSubject.value.filter(p => p.category === category);
    return of(products).pipe(delay(300));
  }

  addProduct(product: Product): Observable<Product> {
    const products = [...this.productsSubject.value, product];
    this.productsSubject.next(products);
    return of(product).pipe(delay(200));
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    const products = this.productsSubject.value.map(p => p.id === id ? product : p);
    this.productsSubject.next(products);
    return of(product).pipe(delay(200));
  }

  deleteProduct(id: string): Observable<boolean> {
    const products = this.productsSubject.value.filter(p => p.id !== id);
    this.productsSubject.next(products);
    return of(true).pipe(delay(200));
  }

  getFeaturedProducts(): Observable<Product[]> {
    const products = this.productsSubject.value.filter(p => p.featured === true);
    return of(products).pipe(delay(300));
  }

  // Pagination support for admin products table
  getProducts(first: number, rows: number): Observable<{products: Product[], total: number}> {
    const allProducts = this.productsSubject.value;
    const paginated = allProducts.slice(first, first + rows);
    return of({
      products: paginated,
      total: allProducts.length
    }).pipe(delay(500)); // Simulate network delay for smooth loading
  }
}
