import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {API_BASE_URL} from '../../core/config/api-base-url.token';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../../utils/api-routes';
import { DashboardResponse } from '../../models/dashboard/dashboardResponse';

@Injectable({providedIn: 'root'})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);

  loadDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.base}${API_ROUTES.portfolio.dashboard}`);
  }
}
