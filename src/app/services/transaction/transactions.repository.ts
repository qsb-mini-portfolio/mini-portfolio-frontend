
import {Signal} from '@angular/core';
import { Transaction } from '../../models/transaction/transaction.model';
import { UiTransaction } from '../../models/transaction/ui-transaction.model';

export abstract class TransactionsRepository {
  abstract readonly transactions: Signal<readonly UiTransaction[]>
  abstract readonly loading: Signal<boolean>;
  abstract readonly error: Signal<string | null>;
  abstract refresh(params?: { page?: number; size?: number}): void;
  abstract add(tx: Omit<Transaction, 'id'>): void;
  abstract clear(): void;
}
