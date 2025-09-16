import {buildPositions, PricingCatalog, TransactionsRepository} from './transactions.repository';
import {computed, inject, signal, Injectable} from '@angular/core';
import {Position, Transaction} from '../models';
import {TRANSACTIONS_SEED} from '../data/transactions.mock';

@Injectable({ providedIn: 'root' })
export class LocalStorageTransactionsAdapter extends TransactionsRepository {
  private readonly STORAGE_KEY = "mini-portfolio.transactions.v1";
  private readonly catalog = inject(PricingCatalog);

  private readonly _tx = signal<readonly Transaction[]>(this.load());
  readonly transactions = this._tx.asReadonly();

  readonly positions = computed<readonly Position[]>(() =>
  buildPositions(this._tx(), this.catalog.instrumentNames, this.catalog.currentPrices)
  );

  add(tx: Omit<Transaction, 'id'>): void {
    const id = window.crypto.randomUUID?.() ?? String(Date.now());
    const next = [...this._tx(), { ...tx, id }];
    this._tx.set(next);
    this.save(next);
  }

  clear(): void {
    this._tx.set([]);
    this.save([]);
  }

  private load(): readonly Transaction[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) as Transaction[] : TRANSACTIONS_SEED;
    } catch { return TRANSACTIONS_SEED; }
  }
  private save(list: readonly Transaction[]): void {
    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list)); } catch {}
  }
}
