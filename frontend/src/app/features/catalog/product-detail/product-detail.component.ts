import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { PriceDisplayComponent } from '../../../shared/components/price-display/price-display.component';
import { Product, ProductVariant } from '../../../shared/models/product.model';

@Component({
  selector: 'tf-product-detail',
  standalone: true,
  imports: [
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatSnackBarModule,
    LoadingSpinnerComponent,
    PriceDisplayComponent,
  ],
  template: `
    <div class="container py-8 max-w-6xl">
      @if (loading()) {
        <tf-loading-spinner></tf-loading-spinner>
      } @else if (product()) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <!-- Product Image -->
          <div class="space-y-4">
            <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              @if (selectedVariant()?.imageUrl || product()!.imageUrl) {
                <img
                  [src]="selectedVariant()?.imageUrl ?? product()!.imageUrl"
                  [alt]="product()!.name"
                  class="w-full h-full object-cover"
                >
              } @else {
                <div class="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
                  🪟
                </div>
              }
            </div>
          </div>

          <!-- Product Info -->
          <div class="space-y-6">
            <div>
              <p class="text-sm text-gray-500 uppercase tracking-wide mb-1">{{ product()!.category }}</p>
              <h1 class="text-3xl font-bold text-gray-900">{{ product()!.name }}</h1>
            </div>

            <tf-price-display
              [price]="selectedVariant()?.priceOverride ?? product()!.basePrice"
              priceClass="text-2xl font-bold text-tileforms-700">
            </tf-price-display>

            <p class="text-gray-600 leading-relaxed">{{ product()!.description }}</p>

            <!-- Color Selection -->
            @if (availableColors().length > 0) {
              <div>
                <h3 class="font-semibold text-gray-900 mb-3">Color</h3>
                <div class="flex gap-2 flex-wrap">
                  @for (color of availableColors(); track color) {
                    <button
                      (click)="selectColor(color)"
                      [class.ring-2]="selectedColor() === color"
                      [class.ring-tileforms-700]="selectedColor() === color"
                      class="px-4 py-2 rounded border border-gray-300 hover:border-tileforms-700 transition-colors text-sm">
                      {{ color }}
                    </button>
                  }
                </div>
              </div>
            }

            <!-- Size Selection -->
            @if (availableSizes().length > 0) {
              <div>
                <h3 class="font-semibold text-gray-900 mb-3">Size</h3>
                <div class="flex gap-2 flex-wrap">
                  @for (size of availableSizes(); track size) {
                    <button
                      (click)="selectSize(size)"
                      [class.bg-tileforms-700]="selectedSize() === size"
                      [class.text-white]="selectedSize() === size"
                      class="px-4 py-2 rounded border-2 border-tileforms-700 font-medium hover:bg-tileforms-50 transition-colors text-sm">
                      {{ size }}
                    </button>
                  }
                </div>
              </div>
            }

            <!-- Stock Info -->
            @if (selectedVariant()) {
              <p class="text-sm"
                 [class.text-green-600]="selectedVariant()!.stockQuantity > 0"
                 [class.text-red-600]="selectedVariant()!.stockQuantity === 0">
                {{ selectedVariant()!.stockQuantity > 0 ? 'In Stock' : 'Out of Stock' }}
              </p>
            }

            <!-- Add to Cart -->
            <button
              mat-flat-button
              color="primary"
              class="w-full py-3 text-lg"
              [disabled]="!selectedVariant() || selectedVariant()!.stockQuantity === 0"
              (click)="addToCart()">
              <mat-icon class="mr-2">shopping_cart</mat-icon>
              Add to Cart
            </button>
          </div>
        </div>
      } @else {
        <div class="text-center py-16">
          <p class="text-gray-500">Product not found.</p>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly snackBar = inject(MatSnackBar);

  readonly product = signal<Product | null>(null);
  readonly loading = signal(false);
  readonly selectedColor = signal<string | null>(null);
  readonly selectedSize = signal<string | null>(null);

  get selectedVariant(): () => ProductVariant | null {
    return () => {
      const p = this.product();
      if (!p) return null;
      return p.variants.find((v) =>
        (this.selectedColor() ? v.color === this.selectedColor() : true) &&
        (this.selectedSize() ? v.size === this.selectedSize() : true)
      ) ?? p.variants[0] ?? null;
    };
  }

  get availableColors(): () => string[] {
    return () => {
      const p = this.product();
      if (!p) return [];
      return [...new Set(p.variants.map((v) => v.color).filter((c): c is string => !!c))];
    };
  }

  get availableSizes(): () => string[] {
    return () => {
      const p = this.product();
      if (!p) return [];
      return [...new Set(p.variants.map((v) => v.size).filter((s): s is string => !!s))];
    };
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/catalog']);
      return;
    }
    this.loading.set(true);
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product.set(product);
        if (product.variants.length > 0) {
          this.selectedColor.set(product.variants[0].color);
          this.selectedSize.set(product.variants[0].size);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  selectColor(color: string): void {
    this.selectedColor.set(color);
  }

  selectSize(size: string): void {
    this.selectedSize.set(size);
  }

  addToCart(): void {
    const variant = this.selectedVariant()();
    if (!variant) return;
    this.cartService.addItem({ productVariantId: variant.id, quantity: 1 }).subscribe({
      next: () => {
        this.snackBar.open('Added to cart!', 'View Cart', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Failed to add to cart', 'Close', { duration: 3000 });
      },
    });
  }
}
