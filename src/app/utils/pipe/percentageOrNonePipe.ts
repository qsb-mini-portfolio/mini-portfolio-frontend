import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentageOrNone'
})
export class PercentageOrNonePipe implements PipeTransform {
  transform(value: number | null | undefined | string): string {
    if (typeof value == 'string') return '-'
    if (!value) return '-';
    return (value * 100).toFixed(2) + '%';
  }
}