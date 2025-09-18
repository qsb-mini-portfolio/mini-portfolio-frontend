import {HttpClient} from '@angular/common/http';
import {inject, Injectable, signal} from '@angular/core';
import {API_BASE_URL} from '../../core/config/api-base-url.token';
import {firstValueFrom, Observable, of} from 'rxjs';
import {API_ROUTES} from '../../shared/api/api-routes';

export interface StockOption {
  stockId: string;
  symbol: string;
  name?: string;
}

export interface ApiStocksResponse {
  items: Array<{
    stockId: string;
    symbol: string;
    name: string;
    type?: string;
  }>;
  page: number;
  totalElements: number;
}

@Injectable({providedIn: 'root'})
export class StocksService {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);

  private readonly _all = signal<StockOption[]>([]);
  readonly all = this._all.asReadonly();

  async ensureLoaded(): Promise<void> {
    if (this._all().length) return;
    const resp = await firstValueFrom(
      this.http.get<ApiStocksResponse>(`${this.base}${API_ROUTES.stock.root}`)
    );


    const rows = Array.isArray(resp?.items) ? resp.items : [];
    const mapped: StockOption[] = rows.map(r => ({
      stockId: String(r.stockId),
      symbol: String(r.symbol).toUpperCase().trim(),
      name: r.name ?? r.symbol
    }));

    this._all.set(mapped);
  }

  async create(symbol: string, name?: string): Promise<StockOption> {
    const body = {
      symbol: symbol.toUpperCase().trim(),
      name: (name ?? symbol).trim()
    };
    const created = await firstValueFrom(
      this.http.post<{ stockId: string; symbol: string; name?: string }>(
        `${this.base}${API_ROUTES.stock.root}`, body
      )
    );
    const opt: StockOption = {
      stockId: String(created.stockId),
      symbol: String(created.symbol).toUpperCase().trim(),
      name: created.name ?? created.symbol
    };
    this._all.update(list => [opt, ...list]);
    return opt;
  }

  filterLocal(query: string, limit = 20): StockOption[] {
    const q = query.trim().toUpperCase();
    const all = this._all();
    if (!q) return all.slice(0, limit);

    const starts = all.filter(s => s.symbol.startsWith(q) || (s.name ?? '').toUpperCase().startsWith(q));
    if (starts.length >= limit) return starts.slice(0, limit);

    const contains = all.filter(s =>
      !starts.includes(s) && (s.symbol.includes(q) || (s.name ?? '').toUpperCase().includes(q))
    );

    return [...starts, ...contains].slice(0, limit);

  }
}
