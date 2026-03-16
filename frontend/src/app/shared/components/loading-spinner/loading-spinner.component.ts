import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'tf-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="flex items-center justify-center p-8">
      <mat-spinner [diameter]="diameter" [color]="'primary'"></mat-spinner>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent {
  @Input() diameter = 48;
}
