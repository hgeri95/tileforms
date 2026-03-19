import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'tf-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  template: `
    <nav>
      <mat-nav-list>
        <a mat-list-item routerLink="/catalog" routerLinkActive="bg-tileforms-50">
          <mat-icon matListItemIcon>store</mat-icon>
          <span matListItemTitle>Catalog</span>
        </a>
        <a mat-list-item routerLink="/cart" routerLinkActive="bg-tileforms-50">
          <mat-icon matListItemIcon>shopping_cart</mat-icon>
          <span matListItemTitle>Cart</span>
        </a>
        <a mat-list-item routerLink="/account" routerLinkActive="bg-tileforms-50">
          <mat-icon matListItemIcon>account_circle</mat-icon>
          <span matListItemTitle>Account</span>
        </a>
      </mat-nav-list>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent {}
