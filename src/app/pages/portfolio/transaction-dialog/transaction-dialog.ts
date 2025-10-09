 import {Component, inject, signal, Output, EventEmitter} from '@angular/core';
import {AbstractControl,  FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {InputNumber} from 'primeng/inputnumber';
import {DatePickerModule} from 'primeng/datepicker';
import { TransactionService } from '../../../services/transaction/transaction.service';
import { Transaction } from '../../../models/transaction/transaction';
import { SelectModule } from 'primeng/select';
import { Side } from '../../../models/transaction/transaction.model';



@Component({
  selector: 'app-transaction-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    ButtonModule,
    DatePickerModule,
    SelectModule,
    InputNumber
  ],
  templateUrl: './transaction-dialog.html',
  styleUrls: ['./transaction-dialog.scss' , '../portfolio-overview.scss']
})
export class TransactionDialog {
  private readonly transactionSerivce = inject(TransactionService);

  private currentTransaction: Transaction | undefined = undefined;

  visible = signal<boolean>(false);
  loading = signal<boolean>(false);

  symbolInput = '';
  lastQuery = '';
  searching = false;

  @Output() deleteComplete = new EventEmitter<void>();
  @Output() updateComplete = new EventEmitter<void>();

  transactionGroup = new FormGroup({
      date: new FormControl<Date>(new Date()),
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

  open(transaction: Transaction) {
    this.visible.set(true);
    this.currentTransaction = transaction;

    this.transactionGroup.patchValue({
      date : new Date(transaction.date),
      volume : Math.abs(transaction.volume),
      side: transaction.volume > 0 ? 'BUY' : 'SELL',
      price : transaction.price,
    })
  }

  close() {
    this.visible.set(false);
  }

  deleteTransaction() {
    this.loading.set(true);
    this.transactionSerivce.deleteTransaction(this.currentTransaction!.transactionId).subscribe(
      next => {
        this.deleteComplete.emit();
        this.visible.set(false);
        this.loading.set(false);
      }
    );
  }

  submit() {
    if (this.transactionGroup.invalid) return;

    this.loading.set(true);

    let volume = this.transactionGroup.get('volume')!.value!;
    if (this.transactionGroup.get('side')!.value === 'SELL') {
      volume = -volume;
    }

    this.transactionSerivce.updateTransaction(
      this.currentTransaction!.transactionId,
      this.transactionGroup.get('price')!.value!,
      volume,
      this.transactionGroup.get('date')!.value!
    ).subscribe(
      next => {
        this.updateComplete.emit();
        this.visible.set(false);
        this.loading.set(false);
      }
    );
  }
}