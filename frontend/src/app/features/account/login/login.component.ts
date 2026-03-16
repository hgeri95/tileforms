import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'tf-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900">Sign in to TileForms</h2>
          <p class="mt-2 text-gray-600">
            Or <a routerLink="/account/register" class="text-tileforms-700 hover:text-tileforms-600 font-medium">create an account</a>
          </p>
        </div>

        <div class="bg-white rounded-xl shadow-md p-8">
          @if (error()) {
            <div class="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {{ error() }}
            </div>
          }

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <mat-form-field class="w-full">
              <mat-label>Email Address</mat-label>
              <input matInput type="email" formControlName="email" autocomplete="email">
              @if (loginForm.get('email')?.errors?.['required']) {
                <mat-error>Email is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field class="w-full">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword() ? 'password' : 'text'"
                     formControlName="password" autocomplete="current-password">
              <button mat-icon-button matSuffix type="button"
                      (click)="hidePassword.set(!hidePassword())">
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>

            <button mat-flat-button color="primary" type="submit"
                    class="w-full py-3"
                    [disabled]="loginForm.invalid || loading()">
              {{ loading() ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly hidePassword = signal(true);

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.loading.set(true);
    this.error.set(null);

    this.authService.login({
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!,
    }).subscribe({
      next: () => {
        this.loading.set(false);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/account/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Invalid email or password. Please try again.');
      },
    });
  }
}
