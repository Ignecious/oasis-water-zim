import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeaderComponent } from './header.component';
import { CartService } from '../../services/cart.service';
import { BehaviorSubject } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let cartService: CartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        CartService
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with cart item count from CartService', () => {
    expect(component.cartItemCount).toBe(0);
  });

  it('should update cart item count when cart items change', () => {
    cartService.addToCart({ id: '1', name: 'Test Product', price: 10, category: 'test', stock: 10, imageUrl: '' }, 2);
    expect(component.cartItemCount).toBe(2);
  });

  it('should unsubscribe from cart items on destroy', () => {
    const destroySpy = spyOn(component['destroy$'], 'next');
    const completespy = spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completespy).toHaveBeenCalled();
  });
});
