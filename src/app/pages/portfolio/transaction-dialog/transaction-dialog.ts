 import {Component, computed, inject, signal, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {TagModule} from 'primeng/tag';
import {DialogModule} from 'primeng/dialog';
import {InputNumber, InputNumberModule} from 'primeng/inputnumber';
import {DatePickerModule} from 'primeng/datepicker';
import { UserService } from '../../../services/user/userService';
import { PortfolioService } from '../../../services/portfolio/portfolio.service';
import { StocksService, StockOption } from '../../../services/stock/stocks.service';
import { HttpTransactionsAdapter } from '../../../services/transaction/http-transactions.adapter';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-transaction-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, TableModule, ButtonModule, TagModule, DialogModule,
    InputNumberModule, InputNumber, DatePickerModule, FormsModule],
  templateUrl: './transaction-dialog.html',
  styleUrls: ['./transaction-dialog.scss' , '../portfolio-overview.scss']
})
export class TransactionDialog {
  private readonly portfolio = inject(PortfolioService);
  private readonly repo = inject(HttpTransactionsAdapter);
  private readonly fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

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


 readonly transactionForm = this.fb.nonNullable.group(
    {
      id : "",
      date: new Date(),
      volume: 100,
      price: 100,
    }, { validators: [
        (g) => (g.value.volume ?? 0) > 0 && (g.value.price ?? 0) > 0 ? null : { invalidNumbers: true }
      ]}
  );
  readonly showTransactionDialog = signal(false);
  openTransactionDialog() {
    this.showTransactionDialog.set(true);
  }
  closeTransactionDialog() {
    this.showTransactionDialog.set(false);
  }

  handleRowSelect(event : any){
    this.showTransactionDialog.set(true)
    const data = event.data;
    this.transactionForm.patchValue({
      id : data.id,
      date : new Date(data.dateIso),
      volume : data.volume,
      price : data.price
    })
  }

  submitTransactionForm() {
    const formValues = this.transactionForm.getRawValue();
    this.portfolio.updateTransaction(formValues.id, formValues.price, formValues.volume, formValues.date)
    .subscribe(
      next => {
        this.portfolio.refresh();
        this.repo.refresh();
        this.showTransactionDialog.set(false);
        this.toastr.success("Transaction modifiée !", "Succès:");
      }
    );
  }

  deleteTransaction(){
    const formValues = this.transactionForm.getRawValue();
    this.portfolio.deleteTransaction(formValues.id).subscribe(
      next => {
        this.portfolio.refresh();
        this.repo.refresh();
        this.showTransactionDialog.set(false);
        this.toastr.success("Transaction supprimée !", "Succès:");
      }
    );
  }
}