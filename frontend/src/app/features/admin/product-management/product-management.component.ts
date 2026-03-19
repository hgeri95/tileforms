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
  templateUrl: './product-management.component.html',
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
