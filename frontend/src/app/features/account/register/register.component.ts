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
  templateUrl: './register.component.html',
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
