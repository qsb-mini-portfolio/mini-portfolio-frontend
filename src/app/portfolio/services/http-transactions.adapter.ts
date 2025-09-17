import {TransactionsRepository} from './transactions.repository';
import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ApiTransactionPage, Transaction, UiTransaction} from '../models';
import {API_BASE_URL} from '../../core/config/api-base-url.token';

@Injectable({providedIn: 'root'})
export class HttpTransactionsAdapter extends TransactionsRepository {

  private readonly http = inject(HttpClient);
  private apiBase = inject(API_BASE_URL);

  private readonly _data = signal<readonly UiTransaction[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly transactions = this._data.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  refresh(params?: { page?: number; size?: number}): void {
    const page = params?.page ?? 0;
    const size = params?.size ?? 50;

    this._loading.set(true);
    this._error.set(null);

    const httpParams = new HttpParams().set('page', page).set('size', size);

    this.http.get<ApiTransactionPage>(`${this.apiBase}/transaction`, { params: httpParams })
      .subscribe(
        {
          next: (res) => {
            const rows: UiTransaction[] = (res.items ?? []).map((t => ( {
              id: t.transactionId,
              dateIso: t.date,
              side: t.volume > 0 ? 'BUY' : 'SELL',
              symbol: t.stock?.symbol ?? '',
              name: t.stock?.name ?? '',
              price: t.price,
              volume: t.volume,
              amount: t.price * t.volume
            })));
            console.log(rows);
            this._data.set(rows);
            this._loading.set(false);
          },
          error: (e) => {
            this._error.set(e?.message ?? 'Failed to load transactions');
            this._loading.set(false);
          }
        }
      )
  }

  add(tx: Omit<Transaction, "id">): void {
    throw new Error("Method not implemented.");
  }

  clear(): void {
    throw new Error("Method not implemented.");
  }
}
