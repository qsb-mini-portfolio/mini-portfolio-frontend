import {Component, computed, inject, signal} from '@angular/core';
import {HttpTransactionsAdapter} from '../../services';
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
import {InputText} from 'primeng/inputtext';
import { startWith } from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-portfolio-overview',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, TableModule, ButtonModule, TagModule, DialogModule,
    InputNumberModule, Select, InputNumber, DatePickerModule, InputText],
  templateUrl: './portfolio-overview.html',
  styleUrls: ['./portfolio-overview.scss']
})
export class PortfolioOverview {
  private readonly repo = inject(HttpTransactionsAdapter);
  private readonly fb = inject(FormBuilder);

  readonly transactions = this.repo.transactions;
  readonly transactionsMutable = computed(() => [...this.transactions()]);


  readonly showDialog = signal(false);

  ngOnInit(): void {
    this.repo.refresh();
  }

  retry() { this.repo.refresh() };

  readonly form = this.fb.nonNullable.group(
    {
      date: new Date(),
      symbol: '' as string,
      side: 'BUY' as Side,
      volume: 100,
      price: 100,
    }, { validators: [
        (g) => (g.value.volume ?? 0) > 0 && (g.value.price ?? 0) > 0 ? null : { invalidNumbers: true }
      ]}
  );

  readonly formValue = toSignal(this.form.valueChanges.pipe(startWith(this.form.getRawValue())), {
    initialValue: this.form.getRawValue()
  });

  readonly amount = computed(() => {
    const { volume, price } = this.formValue();
    return (volume ?? 0) * (price ?? 0);
  });

  openDialog() {
    this.showDialog.set(true);
  }
  closeDialog() {
    this.showDialog.set(false);
  }

  async submit() {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.repo.add({
      date: new Date(v.date).toISOString().slice(0, 16),
      symbol: v.symbol.trim().toUpperCase(),
      side: v.side,
      volume: v.volume,
      price: v.price
    });
    console.log("Adding transaction: ", v, "")
    this.closeDialog();
  }

  tagSeverity(side: Side) {
    return side === 'BUY' ? 'success' : 'danger';
  }

  trackBySymbol = (_: number, p: any) => p.symbol;
  trackById = (_: number, t:any) => t.id;
}
