import {HttpClient} from '@angular/common/http';
import {inject, Injectable, signal} from '@angular/core';
import {API_BASE_URL} from '../../core/config/api-base-url.token';
import {firstValueFrom, map, Observable, of} from 'rxjs';
import {API_ROUTES} from '../../utils/api-routes';
import { StockResponse } from '../../models/stock/stockResponse';
import { Pagination } from '../../models/pagination';
import { StockPriceGraph } from '../../models/stock/stockPriceGraph.model';

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

  loadStocks(): Observable<StockResponse[]> {
    return this.http.get<Pagination<StockResponse>>(`${this.base}${API_ROUTES.stock.root}`).pipe(
      map(resp => resp.items)
    )
  }

  createStock(symbol: string, name: string): Observable<StockResponse> {
    const body = {
      symbol: symbol.toUpperCase().trim(),
      name: name.trim()
    }
    return this.http.post<StockResponse>(`${this.base}${API_ROUTES.stock.root}`, body);
  }

  getStockPriceGraph(symbol: string, period: string, interval: string): Observable<StockPriceGraph> {
    const url = `${this.base}${API_ROUTES.stock.graph}/${symbol}?period=${period}&interval=${interval}`;
    return this.http.get<StockPriceGraph>(url);
  } 
}
