import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AddToCartRequest, Cart } from '../../shared/models/cart.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/cart`;

  private readonly cartSubject = new BehaviorSubject<Cart | null>(null);
  readonly cart$ = this.cartSubject.asObservable();

  get cartItemCount(): number {
    return this.cartSubject.value?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  }

  get currentCart(): Cart | null {
    return this.cartSubject.value;
  }

  get cartId(): string | null {
    return localStorage.getItem('cart_id');
  }

  loadCart(): Observable<Cart> {
    const cartId = this.cartId;
    if (cartId) {
      return this.http.get<Cart>(`${this.apiUrl}/${cartId}`).pipe(
        tap((cart) => this.cartSubject.next(cart))
      );
    }
    return this.createCart();
  }

  createCart(): Observable<Cart> {
    return this.http.post<Cart>(this.apiUrl, {}).pipe(
      tap((cart) => {
        localStorage.setItem('cart_id', cart.id);
        this.cartSubject.next(cart);
      })
    );
  }

  addItem(request: AddToCartRequest): Observable<Cart> {
    const cartId = this.cartId ?? '';
    return this.http.post<Cart>(`${this.apiUrl}/${cartId}/items`, request).pipe(
      tap((cart) => this.cartSubject.next(cart))
    );
  }

  removeItem(itemId: string): Observable<Cart> {
    const cartId = this.cartId ?? '';
    return this.http.delete<Cart>(`${this.apiUrl}/${cartId}/items/${itemId}`).pipe(
      tap((cart) => this.cartSubject.next(cart))
    );
  }

  clearCart(): Observable<void> {
    const cartId = this.cartId ?? '';
    return this.http.delete<void>(`${this.apiUrl}/${cartId}`).pipe(
      tap(() => this.cartSubject.next(null))
    );
  }
}
