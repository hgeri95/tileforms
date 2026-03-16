import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../shared/models/order.model';

@Component({
  selector: 'tf-order-tracking',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  template: `
    <div class="container py-8 max-w-2xl">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
      <p class="text-gray-600 mb-8">Enter your tracking number to see your order status</p>

      <form [formGroup]="trackingForm" (ngSubmit)="trackOrder()" class="flex gap-3 mb-8">
        <mat-form-field class="flex-1">
          <mat-label>Tracking Number</mat-label>
          <input matInput formControlName="trackingNumber" placeholder="e.g., GLS123456789012">
          <mat-icon matSuffix>local_shipping</mat-icon>
        </mat-form-field>
        <button mat-flat-button color="primary" type="submit"
                [disabled]="trackingForm.invalid || loading()">
          {{ loading() ? 'Searching...' : 'Track' }}
        </button>
      </form>

      @if (error()) {
        <div class="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
          Order not found. Please check your tracking number.
        </div>
      }

      @if (order()) {
        <div class="bg-white rounded-xl shadow-md p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900">Order Status</h2>
            <span class="px-3 py-1 rounded-full text-sm font-medium"
                  [class.bg-yellow-100]="order()!.status === 'PENDING'"
                  [class.text-yellow-800]="order()!.status === 'PENDING'"
                  [class.bg-green-100]="order()!.status === 'DELIVERED'"
                  [class.text-green-800]="order()!.status === 'DELIVERED'"
                  [class.bg-blue-100]="order()!.status === 'SHIPPED'"
                  [class.text-blue-800]="order()!.status === 'SHIPPED'">
              {{ order()!.status }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-gray-500">Order ID</p>
              <p class="font-medium truncate">{{ order()!.id }}</p>
            </div>
            <div>
              <p class="text-gray-500">Email</p>
              <p class="font-medium">{{ order()!.email }}</p>
            </div>
            @if (order()!.trackingNumber) {
              <div>
                <p class="text-gray-500">Tracking Number</p>
                <p class="font-medium">{{ order()!.trackingNumber }}</p>
              </div>
            }
            <div>
              <p class="text-gray-500">Order Date</p>
              <p class="font-medium">{{ order()!.createdAt | date }}</p>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderTrackingComponent {
  private readonly fb = inject(FormBuilder);
  private readonly orderService = inject(OrderService);

  readonly order = signal<Order | null>(null);
  readonly loading = signal(false);
  readonly error = signal(false);

  readonly trackingForm = this.fb.group({
    trackingNumber: ['', Validators.required],
  });

  trackOrder(): void {
    if (this.trackingForm.invalid) return;
    this.loading.set(true);
    this.error.set(false);
    this.orderService.trackOrder(this.trackingForm.value.trackingNumber!).subscribe({
      next: (order) => {
        this.order.set(order);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
        this.order.set(null);
      },
    });
  }
}
