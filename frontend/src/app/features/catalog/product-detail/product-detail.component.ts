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
  templateUrl: './product-detail.component.html',
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
    const variant = this.selectedVariant();
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
