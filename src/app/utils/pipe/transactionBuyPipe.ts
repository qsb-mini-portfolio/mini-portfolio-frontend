import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transactionSeverity'
})
export class TransactionSeverityPipe implements PipeTransform {
  transform(volume: number): string {
    return volume > 0 ? 'success' : 'danger';
  }
}