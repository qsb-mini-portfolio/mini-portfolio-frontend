import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {API_BASE_URL} from '../../core/config/api-base-url.token';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../../utils/api-routes';
import { Transaction } from '../../models/transaction/transaction';
import { Pagination } from '../../models/pagination';
import { Utils } from '../../utils/utils';
import { ImportResult } from '../../models/transaction/import.model';

@Injectable({providedIn: 'root'})
export class TransactionService {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);

  loadTransaction(page: number, size: number): Observable<Pagination<Transaction>> {
    const url = `${this.base}${API_ROUTES.transaction.root}?page=${page}&size=${size}`
    return this.http.get<Pagination<Transaction>>(url);
  }

  createTransaction(stockId: string, price: number, volume: number, date: Date): Observable<Transaction> {
    const body = {
        stockId: stockId,
        price: price,
        volume: volume,
        date: Utils.formatDateToIsoShort(date)
    }
    return this.http.post<Transaction>(`${this.base}${API_ROUTES.transaction.root}`, body);
  }

  importCsv(file: File): Observable<ImportResult> {
    const form = new FormData();
    form.append('file', file);

    return this.http.post<ImportResult>(`${this.base}${API_ROUTES.transaction.import}`, form);
  }

  updateTransaction(transactionId: string, price: number, volume: number, date: Date) : Observable<Transaction>{
    const request = {
      transactionId: transactionId,
      price: price,
      volume: volume,
      date: Utils.formatDateToIsoShort(date)
    }
    
    return this.http.put<Transaction>(`${this.base}${API_ROUTES.transaction.root}`, request);
  }

  deleteTransaction(transactionId : string): Observable<void> {
    return this.http.delete<void>(`${this.base}${API_ROUTES.transaction.root}/${transactionId}`);
  }
  
}
