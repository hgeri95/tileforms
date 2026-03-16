import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./product-management/product-management.component').then(
        (m) => m.ProductManagementComponent
      ),
  },
];
