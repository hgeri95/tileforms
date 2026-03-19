import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'tf-dashboard',
  standalone: true,
  imports: [AsyncPipe, RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);
  readonly currentUser$ = this.authService.currentUser$;

  logout(): void {
    this.authService.logout();
  }
}
