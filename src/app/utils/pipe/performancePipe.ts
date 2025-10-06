import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'performance'
})
export class PerformancePipe implements PipeTransform {
  transform(volume: number): string {
    return volume > 0 ? 'success' : 'danger';
  }
}