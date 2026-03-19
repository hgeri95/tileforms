import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';

@Component({
  selector: 'tf-price-display',
  standalone: true,
  imports: [CurrencyFormatPipe],
  templateUrl: './price-display.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceDisplayComponent {
  @Input({ required: true }) price!: number;
  @Input() originalPrice?: number;
  @Input() currency = 'EUR';
  @Input() priceClass = 'text-lg font-bold text-tileforms-700';
}
