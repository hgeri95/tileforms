import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { PriceDisplayComponent } from '../../../shared/components/price-display/price-display.component';

@Component({
  selector: 'tf-checkout-page',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatIconModule,
    PriceDisplayComponent,
  ],
  templateUrl: './checkout-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  readonly cart$ = this.cartService.cart$;
  readonly submitting = signal(false);

  readonly contactForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: [''],
    lastName: [''],
  });

  readonly shippingForm = this.fb.group({
    street: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: ['', Validators.required],
    country: ['', Validators.required],
  });

  placeOrder(): void {
    this.submitting.set(true);
    const email = this.contactForm.value.email ?? '';
    const cart = this.cartService.currentCart;
    const items = cart?.items.map((item) => ({
      productVariantId: item.productVariantId,
      quantity: item.quantity,
      unitPrice: item.price,
    })) ?? [];

    this.orderService.createOrder({
      email,
      items,
      currency: 'EUR',
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.cartService.clearCart().subscribe();
        this.router.navigate(['/account/dashboard']);
      },
      error: () => {
        this.submitting.set(false);
      },
    });
  }
}
