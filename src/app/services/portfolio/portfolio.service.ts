import {HttpClient} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import {API_BASE_URL} from '../../core/config/api-base-url.token';
import {API_ROUTES} from '../../utils/api-routes';

import { Portfolio } from '../../models/portfolio/portfolio.model';
import { PortfolioGraph } from '../../models/portfolio/portfolioGraph.model';

@Injectable({providedIn: 'root'})
export class PortfolioService {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);

  loadPortfolio(): Observable<Portfolio> {
    return this.http.get<Portfolio>(`${this.base}${API_ROUTES.portfolio.root}`);
  }

  getPortfolioGraph(period: string, interval: string): Observable<PortfolioGraph> {
    const url = `${this.base}${API_ROUTES.portfolio.graph}?period=${period}&interval=${interval}`;
    return this.http.get<PortfolioGraph>(url);
  } 
}
