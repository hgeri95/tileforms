import { Routes } from '@angular/router';

export const TRACKING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./order-tracking/order-tracking.component').then((m) => m.OrderTrackingComponent),
  },
];
