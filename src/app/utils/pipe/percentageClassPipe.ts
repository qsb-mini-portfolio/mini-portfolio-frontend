import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentageColor'
})
export class PercentageColorPipe implements PipeTransform {
  transform(value: number | null | undefined | string, zeroBased: boolean = false): string {
    if (typeof value == 'string') return '';
    if (!value) return '';
    if (zeroBased && value >= 0) return 'green';
    if (value >= 1) return 'green';
    return 'red'
  }
}