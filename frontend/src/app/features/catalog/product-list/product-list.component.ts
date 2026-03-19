import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { PriceDisplayComponent } from '../../../shared/components/price-display/price-display.component';
import { Product, ProductPage } from '../../../shared/models/product.model';

@Component({
  selector: 'tf-product-list',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatPaginatorModule,
    LoadingSpinnerComponent,
    PriceDisplayComponent,
  ],
  templateUrl: './product-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly route = inject(ActivatedRoute);

  readonly products = signal<ProductPage | null>(null);
  readonly loading = signal(false);
  readonly error = signal(false);
  readonly selectedCategory = signal<string | null>(null);

  private currentPage = 0;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.selectedCategory.set(params['category'] ?? null);
      this.loadProducts();
    });
  }

  setCategory(category: string | null): void {
    this.selectedCategory.set(category);
    this.currentPage = 0;
    this.loadProducts();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.loadProducts();
  }

  addToCart(product: Product, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (product.variants.length > 0) {
      this.cartService.addItem({
        productVariantId: product.variants[0].id,
        quantity: 1,
      }).subscribe();
    }
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.error.set(false);
    this.productService.getProducts({
      category: this.selectedCategory() ?? undefined,
      page: this.currentPage,
      size: 12,
    }).subscribe({
      next: (page) => {
        this.products.set(page);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
