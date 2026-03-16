import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { map } from 'rxjs';

@Component({
  selector: 'tf-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
  ],
  template: `
    <mat-toolbar class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div class="container flex items-center justify-between w-full">
        <!-- Logo -->
        <a routerLink="/catalog" class="flex items-center gap-2 no-underline">
          <span class="text-2xl font-bold text-tileforms-700">TileForms</span>
        </a>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center gap-6">
          <a routerLink="/catalog" routerLinkActive="text-tileforms-700 font-semibold"
             class="text-gray-700 hover:text-tileforms-700 transition-colors font-medium">
            Shop
          </a>
          <a routerLink="/catalog" [queryParams]="{ category: 'BOX' }"
             class="text-gray-700 hover:text-tileforms-700 transition-colors font-medium">
            Boxes
          </a>
          <a routerLink="/catalog" [queryParams]="{ category: 'COFFEE_TABLE' }"
             class="text-gray-700 hover:text-tileforms-700 transition-colors font-medium">
            Coffee Tables
          </a>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <!-- Cart -->
          <a routerLink="/cart" mat-icon-button>
            <mat-icon
              [matBadge]="(cartCount$ | async) || null"
              matBadgeColor="warn"
              [matBadgeHidden]="(cartCount$ | async) === 0"
            >
              shopping_cart
            </mat-icon>
          </a>

          <!-- Account -->
          @if (isLoggedIn$ | async) {
            <a routerLink="/account/dashboard" mat-icon-button>
              <mat-icon>account_circle</mat-icon>
            </a>
          } @else {
            <a routerLink="/account/login" mat-button class="text-tileforms-700">
              Sign In
            </a>
          }
        </div>
      </div>
    </mat-toolbar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);

  readonly cartCount$ = this.cartService.cart$.pipe(
    map((cart) => cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0)
  );
  readonly isLoggedIn$ = this.authService.currentUser$.pipe(map((user) => !!user));
}
