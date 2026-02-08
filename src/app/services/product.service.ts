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
      // Bottled Water
      { 
        id: 'p1', 
        name: 'Oasis Sport Water', 
        category: 'water', 
        size: '500ml', 
        price: 0.50, 
        image: 'assets/products/oasis-sport-500ml.jpg', 
        description: 'Perfect for hydration on the go. Pure, refreshing water in a convenient size.',
        stock: 100,
        featured: true
      },
      { 
        id: 'p2', 
        name: 'Oasis Still Water', 
        category: 'water', 
        size: '1.5L', 
        price: 1.00, 
        image: 'assets/products/oasis-1.5l.jpg', 
        description: 'Pure refreshing water for everyday hydration. Ideal for home and office.',
        stock: 150,
        featured: true
      },
      { 
        id: 'p3', 
        name: 'Oasis Still Water', 
        category: 'water', 
        size: '5L', 
        price: 2.50, 
        image: 'assets/products/oasis-5l.jpg', 
        description: 'Ideal for home use. Great value for daily hydration needs.',
        stock: 80,
        featured: false
      },
      { 
        id: 'p4', 
        name: 'Oasis Still Water', 
        category: 'water', 
        size: '10L', 
        price: 4.50, 
        image: 'assets/products/oasis-10l.jpg', 
        description: 'Great value for families. Perfect for larger households.',
        stock: 60,
        featured: false
      },
      { 
        id: 'p5', 
        name: 'Oasis Purified Water', 
        category: 'water', 
        size: '19L', 
        price: 8.00, 
        image: 'assets/products/oasis-19l.jpg', 
        description: 'Bulk water for offices and events. Premium quality purified water.',
        stock: 50,
        featured: true
      },
      
      // Ice Products
      { 
        id: 'p6', 
        name: 'Pluto Ice Cubes', 
        category: 'ice', 
        size: '2kg', 
        price: 1.50, 
        image: 'assets/products/pluto-ice-2kg.jpg', 
        description: 'Crystal clear ice cubes for your drinks. Made from purified water.',
        stock: 120,
        featured: true
      },
      { 
        id: 'p7', 
        name: 'Pluto Ice Cubes', 
        category: 'ice', 
        size: '5kg', 
        price: 3.50, 
        image: 'assets/products/pluto-ice-5kg.jpg', 
        description: 'Perfect for events and parties. High-quality crystal clear ice.',
        stock: 90,
        featured: false
      },
      { 
        id: 'p8', 
        name: 'Pluto Ice Cubes', 
        category: 'ice', 
        size: '8kg', 
        price: 5.00, 
        image: 'assets/products/pluto-ice-8kg.jpg', 
        description: 'Bulk ice for parties and large gatherings. Premium quality.',
        stock: 70,
        featured: false
      },
      { 
        id: 'p9', 
        name: 'Pluto Crushed Ice', 
        category: 'ice', 
        size: '3kg', 
        price: 2.00, 
        image: 'assets/products/pluto-crushed-ice.jpg', 
        description: 'Finely crushed ice perfect for smoothies and cocktails.',
        stock: 85,
        featured: false
      },
      { 
        id: 'p10', 
        name: 'Pluto Ice Tubes', 
        category: 'ice', 
        size: '4kg', 
        price: 2.50, 
        image: 'assets/products/pluto-ice-tubes.jpg', 
        description: 'Tube-shaped ice for long-lasting cooling. Great for coolers.',
        stock: 95,
        featured: false
      },
      
      // More Water Varieties
      { 
        id: 'p11', 
        name: 'Oasis Sparkling Water', 
        category: 'water', 
        size: '330ml', 
        price: 0.75, 
        image: 'assets/products/oasis-sparkling-330ml.jpg', 
        description: 'Refreshing sparkling water with natural carbonation.',
        stock: 110,
        featured: false
      },
      { 
        id: 'p12', 
        name: 'Oasis Flavored Water', 
        category: 'water', 
        size: '500ml', 
        price: 0.85, 
        image: 'assets/products/oasis-flavored-500ml.jpg', 
        description: 'Lightly flavored water with natural fruit essence.',
        stock: 90,
        featured: false
      },
      { 
        id: 'p13', 
        name: 'Oasis Still Water', 
        category: 'water', 
        size: '750ml', 
        price: 0.80, 
        image: 'assets/products/oasis-750ml.jpg', 
        description: 'Mid-size bottle perfect for outdoor activities.',
        stock: 120,
        featured: false
      },
      
      // Accessories
      { 
        id: 'p14', 
        name: 'Keep Bag Cooler', 
        category: 'accessories', 
        size: 'Standard', 
        price: 10.00, 
        image: 'assets/products/cooler-bag.jpg', 
        description: 'Insulated cooler bag to keep your beverages cold. Durable and portable.',
        stock: 40,
        featured: false
      },
      { 
        id: 'p15', 
        name: 'Water Dispenser', 
        category: 'dispensers', 
        size: 'Hot & Cold', 
        price: 45.00, 
        image: 'assets/products/dispenser.jpg', 
        description: 'Dual temperature dispenser for convenience. Hot and cold water on demand.',
        stock: 25,
        featured: false
      },
      { 
        id: 'p16', 
        name: 'Pump Dispenser', 
        category: 'dispensers', 
        size: 'Manual', 
        price: 8.00, 
        image: 'assets/products/pump-dispenser.jpg', 
        description: 'Manual pump dispenser for 19L bottles. No electricity required.',
        stock: 55,
        featured: false
      },
      { 
        id: 'p17', 
        name: 'Ice Bucket', 
        category: 'accessories', 
        size: '5L Capacity', 
        price: 12.00, 
        image: 'assets/products/ice-bucket.jpg', 
        description: 'Insulated ice bucket with lid. Keeps ice frozen for hours.',
        stock: 35,
        featured: false
      },
      { 
        id: 'p18', 
        name: 'Water Bottle Set', 
        category: 'accessories', 
        size: '6x 750ml', 
        price: 15.00, 
        image: 'assets/products/bottle-set.jpg', 
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
