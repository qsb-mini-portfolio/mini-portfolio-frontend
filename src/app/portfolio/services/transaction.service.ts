import {API_BASE_URL} from '../../core/config/api-base-url.token';
import {API_ROUTES} from '../../shared/api/api-routes';
import {HttpClient} from '@angular/common/http';
import {Transaction, CreateTransactionRequest} from '../models';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class TransactionService {
  private readonly base = `${API_BASE_URL}${API_ROUTES.transaction}`;

  constructor(private http: HttpClient) {
  }

  create(dto: CreateTransactionRequest): Observable<Transaction> {
    return this.http.post<Transaction>(this.base, dto);
  }

  list(page = 0, size = 20): Observable<{ items: Transaction[]; page: number; totalElements: number }> {
    return this.http.get<{items: Transaction[]; page: number; totalElements: number}>(
      `${this.base}?page=${page}&size=${size}`
    );
  }
}
