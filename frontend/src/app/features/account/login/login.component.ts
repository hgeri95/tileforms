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
  templateUrl: './login.component.html',
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
