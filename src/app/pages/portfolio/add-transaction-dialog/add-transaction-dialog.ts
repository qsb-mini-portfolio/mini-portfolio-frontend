import {ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Output, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';

import { toSignal } from '@angular/core/rxjs-interop';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SelectModule } from 'primeng/select';

import { Side } from '../../../models/transaction/transaction.model';
import { StockResponse } from '../../../models/stock/stockResponse';
import { StocksService } from '../../../services/stock/stocks.service';
import { CurrencyOrNonePipe } from '../../../utils/pipe/currencyOrNonePipe';
import { TransactionService } from '../../../services/transaction/transaction.service';

@Component({
  selector: 'add-transaction-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    ButtonModule,
    DatePickerModule,
    SelectModule,
    InputNumber,
    AutoCompleteModule,
    CurrencyOrNonePipe
  ],
  templateUrl: 'add-transaction-dialog.html',
  styleUrls: ['./add-transaction-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTransactionDialog {
  stocksService = inject(StocksService)
  transactionService = inject(TransactionService);

  visible = signal<boolean>(false);
  loading = signal<boolean>(false);
  canAdd = signal<boolean>(false);
  stocks: StockResponse[] = [];
  lastQuery = signal<string>('');
  filteredStock = signal<StockResponse[]>([]);
  saveLoading = signal<boolean>(false);
  
  @Output() completed = new EventEmitter<void>();

  transactionGroup = new FormGroup({
      date: new FormControl<Date>(new Date()),
      stock:  new FormControl<StockResponse | null>(null),
      side:  new FormControl<Side>('BUY'),
      volume: new FormControl<number>(100),
      price: new FormControl<number>(100),
    }, { 
      validators: [this.positiveNumbersValidator()]
    });

  private positiveNumbersValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const volume = control.get('volume')?.value ?? 0;
      const price = control.get('price')?.value ?? 0;

      if (volume > 0 && price > 0) {
        return null;
      }
      return { invalidNumbers: true };
    }
  };

  volume = toSignal(this.transactionGroup.get('volume')!.valueChanges, { initialValue: this.transactionGroup.get('volume')!.value });
  price = toSignal(this.transactionGroup.get('price')!.valueChanges, { initialValue: this.transactionGroup.get('price')!.value });

  amount = computed(() => (this.volume() ?? 0) * (this.price() ?? 0));

  submit() {
    if (this.transactionGroup.invalid) return;
    this.saveLoading.set(true);
    let volume = this.transactionGroup.get('volume')!.value!;
    if (this.transactionGroup.get('side')!.value === 'SELL') {
      volume = -volume;
    }
    this.transactionService.createTransaction(
      this.transactionGroup.get('stock')!.value!.stockId,
      this.transactionGroup.get('price')!.value!,
      volume,
      this.transactionGroup.get('date')!.value!
    ).subscribe({
      next: (resp) => { 
        this.saveLoading.set(false);
        this.visible.set(false);
        this.completed.emit();
       },
      error: (err) => console.error(err),
    });
  }
  
  open() {
    this.visible.set(true);
    this.loadStocks();
  }

  close() { 
    this.visible.set(false); 
  }

  loadStocks() {
    this.loading.set(true);
    this.stocksService.loadStocks().subscribe({
      next: (resp) => { 
        this.loading.set(false);
        this.stocks = resp;
        this.filteredStock.set([]);
       },
      error: (err) => console.error('Unable to load stocks')
    })
  }

  onSearch(event: any) {
    let query = this.lastQuery();
    if (event.originalEvent instanceof InputEvent) {
      query = event.query?.toLowerCase() || '';
      this.lastQuery.set(query);
      this.canAdd.set(query != '' && !this.stocks.some(stock => stock.symbol.toLowerCase() === query.toLowerCase()))
    }
    const filtered = this.stocks.filter(
      s => s.name.toLowerCase().includes(query) || s.symbol.toLowerCase().includes(query)
    );
    this.filteredStock.set(filtered);
  }

  onPick(event: any) {
    const stock = event.value;
    this.filteredStock.set([]);
    this.transactionGroup.patchValue({ price: stock.price });
  }

  onDropdownClick() {
    this.filteredStock.set([...this.filteredStock()]);
  }

  createNewStock() {
    this.canAdd.set(false);
    this.loading.set(true);
    this.stocksService.createStock(this.lastQuery(), this.lastQuery()).subscribe({
      next: (resp) => this.loadStocks(),
      error: (err) => console.error('Unable to create new stock')
    })
  }
}
