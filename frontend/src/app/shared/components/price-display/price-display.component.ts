import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';

@Component({
  selector: 'tf-price-display',
  standalone: true,
  imports: [CurrencyFormatPipe],
  template: `
    <span [class]="priceClass">
      {{ price | currencyFormat:currency }}
    </span>
    @if (originalPrice && originalPrice > price) {
      <span class="text-sm text-gray-400 line-through ml-2">
        {{ originalPrice | currencyFormat:currency }}
      </span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceDisplayComponent {
  @Input({ required: true }) price!: number;
  @Input() originalPrice?: number;
  @Input() currency = 'EUR';
  @Input() priceClass = 'text-lg font-bold text-tileforms-700';
}
