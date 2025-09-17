import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorage } from './token-storage.service';
import { catchError, map, tap, throwError } from 'rxjs';
import { API_ROUTES } from '../shared/api/api-routes';
import { API_BASE_URL } from '../core/config/api-base-url.token';

interface RegisterRequest {
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private store = inject(TokenStorage);
  private apiBase = inject(API_BASE_URL);

  isAuthenticated = signal(!!this.store.token);

  login(username: string, password: string) {
    return this.http
      .post(`${this.apiBase}${API_ROUTES.auth.login}`, { username, password }, { responseType: 'text' })
      .pipe(
        map((token) => normalizeToken(token)),
        tap((token) => {
          this.store.setToken(token);
          this.isAuthenticated.set(true);
        }),
        catchError((err) => {
          this.isAuthenticated.set(false);
          return throwError(() => err);
        }),
      );
  }

  register(request: RegisterRequest) {
    return this.http
      .post(`${this.apiBase}${API_ROUTES.auth.register}`, request, {
        observe: 'response',
        responseType: 'text',
      })
      .pipe(
        map((res) => {
          if (res.status === 200 || res.status === 201) {
            return { ok: true, message: res.body?.toString() || '' };
          }
            throw new Error('Unexpected status: ' + res.status);
        }),
        catchError((err) => throwError(() => err)),
      );
  }

  logout() {
    this.store.clear();
    this.isAuthenticated.set(false);
    this.router.navigateByUrl('/login');
  }
}

function normalizeToken(raw: string): string {
  return raw
    .trim()
    .replace(/^Bearer\s+/i, '')
    .replace(/^"(.*)"$/, '$1');
}
