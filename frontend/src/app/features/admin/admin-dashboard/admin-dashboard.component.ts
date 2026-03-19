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
  templateUrl: './admin-dashboard.component.html',
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
