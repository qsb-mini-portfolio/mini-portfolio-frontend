import {computed, inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {API_BASE_URL} from '../../core/config/api-base-url.token';
import {ApiDashboardResponse} from '../models/dashboard.model';
import {firstValueFrom} from 'rxjs';
import {API_ROUTES} from '../../shared/api/api-routes';

@Injectable({providedIn: 'root'})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);

  private readonly _raw = signal<ApiDashboardResponse | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly raw = this._raw.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly netValue = computed(() => this._raw()?.currentPrice ?? null);
  readonly invested = computed(() => this._raw()?.boughtPrice ?? null);
  readonly performancePct = computed(() => {
    const y = this._raw()?.yield;
    return y == null ? null : y * 100;
  });

  readonly sectorDonutSeries = computed(() => {
    const data = this._raw();
    if (!data) return [];

    const sectors = data.sectors ?? [];
    return sectors.map(s => s.currentPrice ?? 0);
  });

  readonly sectorDonutLabels = computed(() => {
    const data = this._raw();
    if (!data) return [];

    const sectors = data.sectors ?? [];
    return sectors.map(s => s.sector);
  });

  readonly sectorChartData = computed(() => {
    const d = this._raw();
    if (!d) return {labels: [], datasets: []};

    const sectors = d.sectors ?? [];
    const total = sectors.reduce((sum, s) => sum + (s.currentPrice ?? 0), 0);

    const labels = sectors.map(s => s.sector);
    const values = sectors.map(s => total > 0 ? (s.currentPrice / total) * 100 : 0);

    return {
      labels,
      datasets: [{data: values}]
    };

  })

  async load() {
    this._loading.set(true);
    this._error.set(null);

    try {
      const d = await firstValueFrom(
        this.http.get<ApiDashboardResponse>(`${this.base}${API_ROUTES.portfolio.dashboard}`)
      );
      this._raw.set(d);
    } catch (e: any) {
      this._error.set(e?.error?.message ?? e?.message ?? 'Failed to load dashboard');
    } finally {
      this._loading.set(false);
    }
  }
}
