import {HttpClient} from '@angular/common/http';
import {computed, effect, inject, Injectable, signal} from '@angular/core';
import {API_BASE_URL} from '../../core/config/api-base-url.token';
import {ApiPosition, ApiPositionResponse, UiPosition} from '../models';
import {API_ROUTES} from '../../utils/api-routes';
import {catchError, forkJoin, map, of} from 'rxjs';
import {HttpTransactionsAdapter} from './http-transactions.adapter';

@Injectable({providedIn: 'root'})
export class PortfolioService {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);
  private readonly txRepo = inject(HttpTransactionsAdapter);

  private readonly _raw = signal<ApiPositionResponse | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  constructor() {
    effect(() => {

      const _ = this.txRepo.mutations();
      queueMicrotask(() => this.refresh());
    });
  }

  readonly positions = computed<UiPosition[]>(() =>
  {
    const data = this._raw();
    if(!data) return [];
    const rows = data.stocks ?? [];

    const mvSum = rows
      .map(r => (r.currentPrice ?? 0) * r.volume)
      .reduce((a,b) => a+b, 0);

    return rows.map<UiPosition>(r => {
      const currentPrice = r.currentPrice ?? undefined;
      const avgCost = r.volume !== 0 ? (r.boughtPrice / Math.abs(r.volume)) : undefined;
      const weightPct = r.part ?? undefined;
      const yieldPct = r.yield ?? undefined;

      return {
        symbol: r.symbol,
        name: r.name,
        volume: r.volume,
        currentPrice,
        yieldPct,
        weightPct : weightPct,
        avgCost,
        boughtPrice: r.boughtPrice
      };
    });
  });

  refresh(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<ApiPositionResponse>(`${this.base}${API_ROUTES.portfolio.root}`)
      .pipe(
        catchError(err => {
          this._error.set(err?.error?.message ?? err?.message ?? 'Failed to load portfolio');
          this._loading.set(false);
          return of(null);
        })
      )
      .subscribe(
        res => {
          if (!res) return;

          const missing = (res.stocks ?? [])
            .filter(s => s.currentPrice == null)
            .map(s => s.symbol.toUpperCase().trim());

          if (missing.length === 0) {
            this._raw.set(res);
            this._loading.set(false);
            return;
          }

          const uniqueMissing = Array.from(new Set(missing));
          const calls = uniqueMissing.map(sym =>
          this.http.get<number>(`${this.base}${API_ROUTES.stock.stockBySymbol(sym)}`)
            .pipe(
              map(price => ({sym, price})),
              catchError(_ => of({sym, price: undefined as number | undefined}))
            )
          );

          forkJoin(calls).subscribe(enriched => {
            const priceMap = new Map<string, number | undefined>(
              enriched.map(x => [x.sym, x.price])
            );

            const patchedStocks: ApiPosition[] = res.stocks.map(s => {
              if (s.currentPrice != null) return s;
              const p = priceMap.get(s.symbol.toUpperCase().trim());
              return { ...s, currentPrice: (p ?? null)};
            });

            const patched: ApiPositionResponse = { ...res, stocks: patchedStocks };

            this._raw.set(patched);
            this._loading.set(false);
          })
        }
      )
  }
}
