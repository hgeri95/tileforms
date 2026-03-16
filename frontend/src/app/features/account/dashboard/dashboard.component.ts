import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'tf-dashboard',
  standalone: true,
  imports: [AsyncPipe, RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <div class="container py-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-900">My Account</h1>
        <button mat-stroked-button color="warn" (click)="logout()">
          <mat-icon>logout</mat-icon>
          Sign Out
        </button>
      </div>

      @if (currentUser$ | async; as user) {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Profile Card -->
          <mat-card>
            <mat-card-header>
              <mat-icon mat-card-avatar>account_circle</mat-icon>
              <mat-card-title>{{ user.firstName }} {{ user.lastName }}</mat-card-title>
              <mat-card-subtitle>{{ user.email }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p class="text-sm text-gray-500">Role: {{ user.role }}</p>
            </mat-card-content>
          </mat-card>

          <!-- Orders Card -->
          <mat-card class="cursor-pointer hover:shadow-lg transition-shadow">
            <mat-card-header>
              <mat-icon mat-card-avatar>receipt</mat-icon>
              <mat-card-title>My Orders</mat-card-title>
              <mat-card-subtitle>View order history</mat-card-subtitle>
            </mat-card-header>
            <mat-card-actions>
              <a routerLink="/tracking" mat-button color="primary">View Orders</a>
            </mat-card-actions>
          </mat-card>

          <!-- Admin Card -->
          @if (user.role === 'ADMIN') {
            <mat-card class="border-2 border-tileforms-700">
              <mat-card-header>
                <mat-icon mat-card-avatar color="primary">admin_panel_settings</mat-icon>
                <mat-card-title>Admin Panel</mat-card-title>
                <mat-card-subtitle>Manage products and orders</mat-card-subtitle>
              </mat-card-header>
              <mat-card-actions>
                <a routerLink="/admin" mat-button color="primary">Go to Admin</a>
              </mat-card-actions>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);
  readonly currentUser$ = this.authService.currentUser$;

  logout(): void {
    this.authService.logout();
  }
}
