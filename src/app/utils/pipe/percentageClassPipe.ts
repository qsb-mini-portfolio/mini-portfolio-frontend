import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentageColor'
})
export class PercentageColorPipe implements PipeTransform {
  transform(value: number | null | undefined | string): string {
    if (typeof value == 'string') return '';
    if (!value) return '';
    if (value >= 1) return 'green';
    return 'red'
  }
}