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
  templateUrl: './header.component.html',
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
