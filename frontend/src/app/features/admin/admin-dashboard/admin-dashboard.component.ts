import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { PriceDisplayComponent } from '../../../shared/components/price-display/price-display.component';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
}

@Component({
  selector: 'tf-admin-dashboard',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterLink, PriceDisplayComponent],
  template: `
    <div class="container py-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <a routerLink="/admin/products" mat-flat-button color="primary">
          Manage Products
        </a>
      </div>

      @if (stats()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <mat-card class="text-center p-6">
            <mat-icon class="text-4xl text-blue-500 mb-2">inventory_2</mat-icon>
            <p class="text-3xl font-bold text-gray-900">{{ stats()!.totalProducts }}</p>
            <p class="text-gray-500">Total Products</p>
          </mat-card>
          <mat-card class="text-center p-6">
            <mat-icon class="text-4xl text-green-500 mb-2">receipt</mat-icon>
            <p class="text-3xl font-bold text-gray-900">{{ stats()!.totalOrders }}</p>
            <p class="text-gray-500">Total Orders</p>
          </mat-card>
          <mat-card class="text-center p-6">
            <mat-icon class="text-4xl text-yellow-500 mb-2">pending</mat-icon>
            <p class="text-3xl font-bold text-gray-900">{{ stats()!.pendingOrders }}</p>
            <p class="text-gray-500">Pending Orders</p>
          </mat-card>
          <mat-card class="text-center p-6">
            <mat-icon class="text-4xl text-tileforms-700 mb-2">payments</mat-icon>
            <p class="text-gray-500">Total Revenue</p>
            <tf-price-display [price]="stats()!.totalRevenue" priceClass="text-3xl font-bold text-tileforms-700"></tf-price-display>
          </mat-card>
        </div>
      } @else {
        <div class="text-center py-16">
          <p class="text-gray-500">Loading dashboard...</p>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit {
  private readonly http = inject(HttpClient);
  readonly stats = signal<DashboardStats | null>(null);

  ngOnInit(): void {
    this.http.get<DashboardStats>(`${environment.apiUrl}/admin/dashboard`)
      .subscribe((stats) => this.stats.set(stats));
  }
}
