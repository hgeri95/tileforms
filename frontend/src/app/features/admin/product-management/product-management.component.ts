import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { PriceDisplayComponent } from '../../../shared/components/price-display/price-display.component';
import { Product } from '../../../shared/models/product.model';

@Component({
  selector: 'tf-product-management',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, RouterLink, PriceDisplayComponent],
  template: `
    <div class="container py-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Product Management</h1>
        <button mat-flat-button color="primary">
          <mat-icon>add</mat-icon>
          Add Product
        </button>
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table mat-table [dataSource]="products()" class="w-full">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef class="font-semibold">Name</th>
            <td mat-cell *matCellDef="let product">{{ product.name }}</td>
          </ng-container>
          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef>Category</th>
            <td mat-cell *matCellDef="let product">{{ product.category }}</td>
          </ng-container>
          <ng-container matColumnDef="price">
            <th mat-header-cell *matHeaderCellDef>Base Price</th>
            <td mat-cell *matCellDef="let product">
              <tf-price-display [price]="product.basePrice" priceClass="text-sm font-medium"></tf-price-display>
            </td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let product">
              <span [class.text-green-600]="product.isActive" [class.text-red-600]="!product.isActive">
                {{ product.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let product">
              <a mat-icon-button [routerLink]="['/catalog', product.id]">
                <mat-icon>visibility</mat-icon>
              </a>
              <button mat-icon-button color="primary">
                <mat-icon>edit</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductManagementComponent implements OnInit {
  private readonly productService = inject(ProductService);

  readonly products = signal<Product[]>([]);
  readonly displayedColumns = ['name', 'category', 'price', 'status', 'actions'];

  ngOnInit(): void {
    this.productService.getProducts({ size: 100 }).subscribe((page) => {
      this.products.set(page.content);
    });
  }
}
