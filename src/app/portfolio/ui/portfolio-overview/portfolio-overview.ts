import {Component, computed, inject, signal} from '@angular/core';
import {LocalStorageTransactionsAdapter, PricingCatalog} from '../../services';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {Side} from '../../models';
import {CommonModule} from '@angular/common';
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {TagModule} from 'primeng/tag';
import {DialogModule} from 'primeng/dialog';
import {InputNumber, InputNumberModule} from 'primeng/inputnumber';
import {Select} from 'primeng/select';
import {DatePickerModule} from 'primeng/datepicker';


@Component({
  selector: 'app-portfolio-overview',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, TableModule, ButtonModule, TagModule, DialogModule,
  InputNumberModule, Select, InputNumber, DatePickerModule],
  templateUrl: './portfolio-overview.html',
  styleUrls: ['./portfolio-overview.scss']
})
export class PortfolioOverview {
  private readonly repo = inject(LocalStorageTransactionsAdapter);
  private readonly fb = inject(FormBuilder);
  readonly catalog = inject(PricingCatalog);

  readonly transactions = this.repo.transactions;
  readonly positions = this.repo.positions;

  readonly positionsMutable = computed(() => [...this.positions()]);
  readonly transactionsMutable = computed(() => [...this.transactions()]);


  readonly showDialog = signal(false);

  readonly instruments = Object.keys(this.catalog.instrumentNames).map(sym =>
    (
      {
        label: `${sym} - ${this.catalog.instrumentNames[sym]}`, value: sym
      }
    ));

  readonly form = this.fb.nonNullable.group(
    {
      date: new Date(),
      symbol: this.instruments[0]?.value ?? 'ABC',
      side: 'BUY' as Side,
      quantity: 100,
      price: 100,
    }, { validators: [
        (g) => (g.value.quantity ?? 0) > 0 && (g.value.price ?? 0) > 0 ? null : { invalidNumbers: true }
      ]}
  );

  readonly amount = computed(() => {
    const { quantity, price } = this.form.getRawValue();
    return (quantity ?? 0) * (price ?? 0);
  });

  openDialog() {
    this.showDialog.set(true);
  }
  closeDialog() {
    this.showDialog.set(false);
  }

  submit() {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.repo.add({
      date: new Date(v.date).toISOString().slice(0,10),
      symbol: v.symbol,
      side: v.side,
      quantity: v.quantity,
      price: v.price
    });
    this.closeDialog();
  }

  tagSeverity(side: Side) {
    return side === 'BUY' ? 'success' : 'danger';
  }

  trackBySymbol = (_: number, p: any) => p.symbol;
  trackById = (_: number, t:any) => t.id;
}
