import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { RouterTestingModule } from '@angular/router/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Cart } from '../../../shared/models/cart.model';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;

  const mockProductPage = {
    content: [
      {
        id: '1',
        name: 'Mosaic Box',
        description: 'A beautiful tile-covered box',
        basePrice: 49.99,
        category: 'BOX' as const,
        imageUrl: null,
        isActive: true,
        variants: [],
      },
    ],
    totalElements: 1,
    totalPages: 1,
    currentPage: 0,
  };

  beforeEach(async () => {
    const cartSubject = new BehaviorSubject<Cart | null>(null);
    productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts']);
    cartServiceSpy = jasmine.createSpyObj('CartService', ['addItem', 'loadCart'], {
      cart$: cartSubject.asObservable(),
    });

    productServiceSpy.getProducts.and.returnValue(of(mockProductPage));

    await TestBed.configureTestingModule({
      imports: [ProductListComponent, RouterTestingModule],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        provideAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(productServiceSpy.getProducts).toHaveBeenCalled();
    expect(component.products()?.content.length).toBe(1);
  });

  it('should display product name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Mosaic Box');
  });

  it('should filter by category', () => {
    component.setCategory('BOX');
    expect(productServiceSpy.getProducts).toHaveBeenCalledWith(
      jasmine.objectContaining({ category: 'BOX' })
    );
  });
});
