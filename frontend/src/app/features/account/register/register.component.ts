import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'tf-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900">Create an account</h2>
          <p class="mt-2 text-gray-600">
            Already have one? <a routerLink="/account/login" class="text-tileforms-700 font-medium">Sign in</a>
          </p>
        </div>

        <div class="bg-white rounded-xl shadow-md p-8">
          @if (error()) {
            <div class="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">{{ error() }}</div>
          }

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <mat-form-field>
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstName">
              </mat-form-field>
              <mat-form-field>
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName">
              </mat-form-field>
            </div>
            <mat-form-field class="w-full">
              <mat-label>Email Address</mat-label>
              <input matInput type="email" formControlName="email">
              @if (registerForm.get('email')?.errors?.['email']) {
                <mat-error>Please enter a valid email</mat-error>
              }
            </mat-form-field>
            <mat-form-field class="w-full">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password">
              @if (registerForm.get('password')?.errors?.['minlength']) {
                <mat-error>Password must be at least 8 characters</mat-error>
              }
            </mat-form-field>
            <button mat-flat-button color="primary" type="submit"
                    class="w-full py-3"
                    [disabled]="registerForm.invalid || loading()">
              {{ loading() ? 'Creating account...' : 'Create Account' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly registerForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    this.authService.register({
      email: this.registerForm.value.email!,
      password: this.registerForm.value.password!,
      firstName: this.registerForm.value.firstName ?? undefined,
      lastName: this.registerForm.value.lastName ?? undefined,
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/account/dashboard']);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Registration failed. Email may already be in use.');
      },
    });
  }
}
