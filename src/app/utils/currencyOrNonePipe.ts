import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyOrNone'
})
export class CurrencyOrNonePipe implements PipeTransform {
  transform(value: number | null | undefined, digits: string = '1.2-2'): string {
    if (value == null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: Number(digits.split('-')[0]),
      maximumFractionDigits: Number(digits.split('-')[1]),
    }).format(value);
  }
}