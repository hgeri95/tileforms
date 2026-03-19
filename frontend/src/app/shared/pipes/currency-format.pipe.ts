import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
  standalone: true,
  pure: true,
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number, currency: string = 'EUR', locale: string = 'en-GB'): string {
    const currencyLocaleMap: Record<string, string> = {
      EUR: 'de-DE',
      HUF: 'hu-HU',
      USD: 'en-US',
      GBP: 'en-GB',
    };
    const resolvedLocale = currencyLocaleMap[currency] ?? locale;
    return new Intl.NumberFormat(resolvedLocale, {
      style: 'currency',
      currency,
      minimumFractionDigits: currency === 'HUF' ? 0 : 2,
    }).format(value);
  }
}
