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
  template: `
    <div class="container py-8 max-w-3xl">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <mat-stepper [linear]="true" #stepper>
        <!-- Step 1: Contact -->
        <mat-step [stepControl]="contactForm" label="Contact Information">
          <form [formGroup]="contactForm" class="space-y-4 pt-4">
            <mat-form-field class="w-full">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" placeholder="your@email.com">
              @if (contactForm.get('email')?.errors?.['required']) {
                <mat-error>Email is required</mat-error>
              }
            </mat-form-field>
            <mat-form-field class="w-full">
              <mat-label>First Name</mat-label>
              <input matInput formControlName="firstName">
            </mat-form-field>
            <mat-form-field class="w-full">
              <mat-label>Last Name</mat-label>
              <input matInput formControlName="lastName">
            </mat-form-field>
            <div class="flex justify-end">
              <button mat-flat-button color="primary" matStepperNext
                      [disabled]="contactForm.invalid">
                Next
              </button>
            </div>
          </form>
        </mat-step>

        <!-- Step 2: Shipping -->
        <mat-step [stepControl]="shippingForm" label="Shipping Address">
          <form [formGroup]="shippingForm" class="space-y-4 pt-4">
            <mat-form-field class="w-full">
              <mat-label>Street Address</mat-label>
              <input matInput formControlName="street">
            </mat-form-field>
            <div class="grid grid-cols-2 gap-4">
              <mat-form-field>
                <mat-label>City</mat-label>
                <input matInput formControlName="city">
              </mat-form-field>
              <mat-form-field>
                <mat-label>Postal Code</mat-label>
                <input matInput formControlName="postalCode">
              </mat-form-field>
            </div>
            <mat-form-field class="w-full">
              <mat-label>Country</mat-label>
              <input matInput formControlName="country" placeholder="e.g., Hungary">
            </mat-form-field>
            <div class="flex justify-between">
              <button mat-button matStepperPrevious>Back</button>
              <button mat-flat-button color="primary" matStepperNext
                      [disabled]="shippingForm.invalid">
                Next
              </button>
            </div>
          </form>
        </mat-step>

        <!-- Step 3: Payment -->
        <mat-step label="Payment">
          <div class="pt-4 space-y-6">
            @if (cart$ | async; as cart) {
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-3">Order Summary</h3>
                @for (item of cart.items; track item.id) {
                  <div class="flex justify-between text-sm mb-2">
                    <span>{{ item.productName }} x {{ item.quantity }}</span>
                    <tf-price-display [price]="item.price * item.quantity" priceClass="text-sm font-medium"></tf-price-display>
                  </div>
                }
                <div class="border-t pt-2 mt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <tf-price-display [price]="cart.totalAmount" priceClass="font-bold text-tileforms-700"></tf-price-display>
                </div>
              </div>
            }

            <!-- Google Pay / Stripe Payment Button placeholder -->
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <mat-icon class="text-4xl text-gray-400 mb-2">payment</mat-icon>
              <p class="text-gray-500 mb-4">Payment integration via Stripe (Google Pay supported)</p>
              <button mat-flat-button color="primary" class="px-8 py-2"
                      [disabled]="submitting()"
                      (click)="placeOrder()">
                @if (submitting()) {
                  Processing...
                } @else {
                  Place Order
                }
              </button>
            </div>

            <div class="flex justify-start">
              <button mat-button matStepperPrevious>Back</button>
            </div>
          </div>
        </mat-step>
      </mat-stepper>
    </div>
  `,
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
