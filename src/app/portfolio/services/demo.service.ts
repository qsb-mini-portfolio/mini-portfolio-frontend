import {Inject, inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_BASE_URL} from '../../core/config/api-base-url.token';
import {API_ROUTES} from '../../shared/api/api-routes';

@Injectable({providedIn: 'root'})
export class DemoService {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);

  startDemo() {
    this.http.get(`${this.base}${API_ROUTES.demo.root}`, { responseType: 'text' })
      .subscribe({
        next: (token: string) => {
          localStorage.setItem('auth_token', token?.trim() ?? '');

        },
        error: (err) => {
          console.error('Demo start failed', err);
        }
      });
  }
}
