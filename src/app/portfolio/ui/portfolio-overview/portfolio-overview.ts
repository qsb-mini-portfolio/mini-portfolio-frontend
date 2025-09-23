import {Component, computed, inject, signal, OnInit, ViewChild} from '@angular/core';
import {HttpTransactionsAdapter} from '../../services';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {debounceTime, distinctUntilChanged, map, startWith, Subject, tap} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';
import {PortfolioService} from '../../services/portfolio.service';
import {AutoComplete, AutoCompleteCompleteEvent, AutoCompleteSelectEvent} from 'primeng/autocomplete';
import {StockOption, StocksService} from '../../services/stocks.service';
import {ImportCsvDialog} from './import-csv-dialog';

@Component({
  selector: 'app-portfolio-overview',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, TableModule, ButtonModule, TagModule, DialogModule,
    InputNumberModule, Select, InputNumber, DatePickerModule, AutoComplete, FormsModule, ImportCsvDialog],
  templateUrl: './portfolio-overview.html',
  styleUrls: ['./portfolio-overview.scss']
})
export class PortfolioOverview implements OnInit {
  private readonly portfolio = inject(PortfolioService);
  private readonly repo = inject(HttpTransactionsAdapter);
  private readonly fb = inject(FormBuilder);

  readonly transactions = this.repo.transactions;
  readonly transactionsMutable = computed(() => [...this.transactions()]);

  private readonly stocks = inject(StocksService);

  positions = this.portfolio.positions;
  loading = this.portfolio.loading;
  error = this.portfolio.error;

  readonly showDialog = signal(false);

  symbolInput = '';
  suggestions: StockOption[] = [];
  lastQuery = '';
  searching = false;

  private query$ = new Subject<string>();

  @ViewChild('csvDlg') csvDlg!: ImportCsvDialog;

  openImport() {
    this.csvDlg.open();
  }

  onCsvImported(_: {detectedRows: number; savedRows: number}) {
    this.repo.refresh();

    this.portfolio.refresh();
  }

  async ngOnInit() {
    this.repo.refresh();
    this.portfolio.refresh();

    await this.stocks.ensureLoaded();

    this.query$
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(q => { this.searching = true; this.lastQuery = q;}),
        map(q => this.stocks.filterLocal(q, 20)),
        tap(() => this.searching = false)
        )
      .subscribe(list => this.suggestions = list);

    this.suggestions = this.stocks.filterLocal('', 20);
  }

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
    this.portfolio.refresh();
  }

  tagSeverity(side: Side) {
    return side === 'BUY' ? 'success' : 'danger';
  }

  tagPerformance(pct?: number) {
    return pct ? (pct > 0 ? 'success' : 'danger') : 'neutral';
  }

  formatYield(yieldPct?: number): string {
    if (yieldPct === undefined || yieldPct === null) {
      return '';
    }
    const percentage = yieldPct * 100;
    return `${percentage.toFixed(2)}%`;
  }

  retry() {
    this.repo.refresh()
    this.portfolio.refresh()
  };

  onSearch(event: AutoCompleteCompleteEvent) {
    this.query$.next(event.query ?? '');
  }

  onPick(event: AutoCompleteSelectEvent) {
    const opt = event.value as StockOption;
    this.form.patchValue({symbol: opt.symbol});
    this.symbolInput = opt.symbol;
  }

  canAdd(): boolean {
    const q = this.lastQuery?.trim();
    if (!q) return false;
    const qU = q.toUpperCase();
    const exists = this.suggestions.some(s => s.symbol === qU);
    return (!this.searching && !exists);
  }

  async createFromQuery() {
    const q = (this.lastQuery ?? '').trim();
    if (!q) return;

    this.searching = true;

    try {
      const created = await this.stocks.create(q, q);
      this.form.patchValue({symbol: created.symbol});
      this.symbolInput = created.symbol;

      this.suggestions = this.stocks.filterLocal('', 20);
    } finally {
      this.searching = false;
    }
  }
}
