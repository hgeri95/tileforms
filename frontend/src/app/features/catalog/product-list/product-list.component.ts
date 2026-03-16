import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
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
    AsyncPipe,
    NgClass,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatPaginatorModule,
    LoadingSpinnerComponent,
    PriceDisplayComponent,
  ],
  template: `
    <div class="container py-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
        <p class="text-gray-600">Handcrafted tile-covered furniture for every home</p>
      </div>

      <!-- Category Filter -->
      <div class="flex gap-3 mb-8 flex-wrap">
        <button
          (click)="setCategory(null)"
          [class.bg-tileforms-700]="!selectedCategory()"
          [class.text-white]="!selectedCategory()"
          class="px-4 py-2 rounded-full border-2 border-tileforms-700 font-medium transition-colors">
          All
        </button>
        <button
          (click)="setCategory('BOX')"
          [class.bg-tileforms-700]="selectedCategory() === 'BOX'"
          [class.text-white]="selectedCategory() === 'BOX'"
          class="px-4 py-2 rounded-full border-2 border-tileforms-700 font-medium transition-colors">
          Boxes
        </button>
        <button
          (click)="setCategory('COFFEE_TABLE')"
          [class.bg-tileforms-700]="selectedCategory() === 'COFFEE_TABLE'"
          [class.text-white]="selectedCategory() === 'COFFEE_TABLE'"
          class="px-4 py-2 rounded-full border-2 border-tileforms-700 font-medium transition-colors">
          Coffee Tables
        </button>
      </div>

      <!-- Product Grid -->
      @if (loading()) {
        <tf-loading-spinner></tf-loading-spinner>
      } @else if (products()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (product of products()!.content; track product.id) {
            <mat-card class="product-card hover:shadow-lg transition-shadow duration-200 cursor-pointer">
              <a [routerLink]="['/catalog', product.id]" class="no-underline">
                <div class="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                  @if (product.imageUrl) {
                    <img [src]="product.imageUrl" [alt]="product.name"
                         class="w-full h-full object-cover">
                  } @else {
                    <span class="text-gray-400 text-4xl">🪟</span>
                  }
                </div>
                <mat-card-content class="p-4">
                  <h3 class="font-semibold text-gray-900 mb-1">{{ product.name }}</h3>
                  <p class="text-sm text-gray-500 mb-3 line-clamp-2">{{ product.description }}</p>
                  <tf-price-display [price]="product.basePrice"></tf-price-display>
                </mat-card-content>
              </a>
              <mat-card-actions class="px-4 pb-4">
                <button mat-flat-button color="primary" class="w-full"
                        (click)="addToCart(product, $event)">
                  Add to Cart
                </button>
              </mat-card-actions>
            </mat-card>
          }
        </div>

        <!-- Pagination -->
        @if (products()!.totalPages > 1) {
          <mat-paginator
            [length]="products()!.totalElements"
            [pageSize]="12"
            [pageIndex]="products()!.currentPage"
            (page)="onPageChange($event)"
            class="mt-8">
          </mat-paginator>
        }
      } @else if (error()) {
        <div class="text-center py-16">
          <p class="text-gray-500">Failed to load products. Please try again.</p>
        </div>
      }
    </div>
  `,
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
