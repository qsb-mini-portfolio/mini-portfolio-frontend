import {TransactionsRepository} from './transactions.repository';
import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ApiTransactionPage, CreateStockRequest, CreateTransactionRequest, Transaction, UiTransaction} from '../models';
import {API_BASE_URL} from '../../core/config/api-base-url.token';
import {API_ROUTES} from '../../utils/api-routes';
import {of, tap, switchMap, catchError, map, throwError, Observable} from 'rxjs';

type StockLookupDto = { stockId: string; symbol: string; name?: string };
export type ImportResult = { detectedRows: number; savedRows: number};
@Injectable({providedIn: 'root'})
export class HttpTransactionsAdapter extends TransactionsRepository {

  private readonly http = inject(HttpClient);
  private apiBase = inject(API_BASE_URL);

  private readonly _data = signal<readonly UiTransaction[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _mutations = signal(0);
  readonly mutations = this._mutations.asReadonly();

  readonly transactions = this._data.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  private readonly stockCache = new Map<string, StockLookupDto>;


  refresh(params?: { page?: number; size?: number }): void {
    const page = params?.page ?? 0;
    const size = params?.size ?? 50;

    this._loading.set(true);
    this._error.set(null);

    const httpParams = new HttpParams().set('page', String(page)).set('size', String(size));

    this.http.get<ApiTransactionPage>(`${this.apiBase}${API_ROUTES.transaction.root}`, {params: httpParams})
      .subscribe(
        {
          next: (res) => {
            const rows: UiTransaction[] = (res.items ?? []).map((t => ({
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

  private resolveStockBySymbol(symbol: string) {
    const key = symbol.trim().toUpperCase();
    const cached = this.stockCache.get(key);
    if (cached) return of(cached);

    return this.http.get<StockLookupDto>(`${this.apiBase}${API_ROUTES.stock.stockBySymbol(key)}`).pipe(
      tap(dto => this.stockCache.set(key, {...dto, symbol:key}))
    );
  }

  private createStock(req: CreateStockRequest) {
    const key = req.symbol.trim().toUpperCase();
    const body: CreateStockRequest = {
      symbol: key, name: key
    };

    return this.http.post<StockLookupDto>(`${this.apiBase}${API_ROUTES.stock.root}`, body).pipe(
      tap(dto => {
        this.stockCache.set(key, { ...dto, symbol: key})
      })
    );
  }

  private resolveOrCreateStock(symbol: string, name?: string) {
    const key = symbol.trim().toUpperCase();
    return this.resolveStockBySymbol(key).pipe(
      catchError(err => {
        if (err?.status === 404) {
          return this.createStock({ symbol: key, name});
        }

        if (err?.status === 409) {
          return this.resolveStockBySymbol(key);
        }
        return throwError(() => err);
      })
    )
  }

  add(tx: Omit<Transaction, "id">): void {
    const symbol = tx.symbol.trim().toUpperCase();

    const tempId = `tmp-${Date.now()}`;
    const optimistic: UiTransaction = {
      id: tempId,
      dateIso: tx.date,
      side: tx.side,
      symbol,
      name: '',
      price: Number(tx.price),
      volume: tx.volume,
      amount: Math.abs(Number(tx.volume)) * Number(tx.price)
    };

    const prev = this._data();
    this._data.set([optimistic, ...prev]);
    this._error.set(null);

    this.resolveOrCreateStock(symbol).pipe(
      switchMap((stock) => {
        const body: CreateTransactionRequest = {
          stockId: stock.stockId,
          price: Number(tx.price),
          volume: (tx.side === 'BUY' ? +1 : -1) * Math.abs(Number(tx.volume)),
          date: tx.date
        };
        return this.http.post<any>(`${this.apiBase}${API_ROUTES.transaction.root}`, body).pipe(
          map(created => ({ created, stock }))
        );
      }),
      catchError(err => {
        this._data.set(prev);
        this._error.set(err?.error?.message ?? err?.message ?? 'Failed to create transaction');
        throw err;
      })
    ).subscribe(({ created, stock}) => {
      if (created?.transactionId) {
        const mapped: UiTransaction = {
          id: created.transactionId,
          dateIso: created.date,
          side: created.volume > 0 ? 'BUY' : 'SELL',
          symbol: created.stock?.symbol ?? symbol,
          name: created.stock?.name ?? stock?.name ?? '',
          price: created.price,
          volume: created.volume,
          amount: Math.abs(created.volume) * created.price
        };
        this._data.set([mapped, ...prev]);
        this._mutations.update(n => n+1);
      } else {
        this.refresh();
      }
    })
  }

  importCsv(file: File): Observable<ImportResult> {
    const form = new FormData();
    form.append('file', file);

    return this.http.post<ImportResult>(`${this.apiBase}${API_ROUTES.transaction.import}`, form);
  }

  clear(): void {
    this._data.set([]);
    this._error.set(null);
    this.stockCache.clear();
  }
}
