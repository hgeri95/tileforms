import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CartService } from '../../../core/services/cart.service';
import { PriceDisplayComponent } from '../../../shared/components/price-display/price-display.component';
import { CartItem } from '../../../shared/models/cart.model';

@Component({
  selector: 'tf-cart-page',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    PriceDisplayComponent,
  ],
  templateUrl: './cart-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPageComponent implements OnInit {
  private readonly cartService = inject(CartService);
  readonly cart$ = this.cartService.cart$;

  ngOnInit(): void {
    this.cartService.loadCart().subscribe();
  }

  removeItem(item: CartItem): void {
    this.cartService.removeItem(item.id).subscribe();
  }
}
