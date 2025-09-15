import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorage } from './token-storage.service';
import { catchError, map, tap, throwError } from 'rxjs';
import { env } from '../../environments/env';
import { API_ROUTES } from '../shared/api/api-routes';

interface RegisterDto {
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private store = inject(TokenStorage);

  isAuthenticated = signal(!!this.store.token);

  login(username: string, password: string) {
    return this.http
      .post(`${env.apiUrl}${API_ROUTES.auth.login}`, { username, password }, { responseType: 'text' })
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

  register(dto: RegisterDto) {
    return this.http.post(`${env.apiUrl}${API_ROUTES.auth.register}`, dto);
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
