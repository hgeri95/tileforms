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
  templateUrl: './order-tracking.component.html',
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
