import { Component, ChangeDetectionStrategy, inject, computed, signal} from '@angular/core';
import { NgClass} from '@angular/common';

import { finalize } from 'rxjs';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ApexNonAxisChartSeries, ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

import { DashboardService } from '../../services/dashboard/dashboard.service';
import { Utils } from '../../utils/utils';

import { CurrencyOrNonePipe } from '../../utils/currencyOrNonePipe';
import { PercentageOrNonePipe } from '../../utils/percentageOrNonePipe';
import { PercentageColorPipe } from '../../utils/percentageClassPipe';

import { DashboardResponse } from '../../models/dashboard/dashboardResponse';
import { ApiPosition } from '../../portfolio/models/position.model';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    NgApexchartsModule,
    NgClass,
    CurrencyOrNonePipe,
    PercentageOrNonePipe,
    PercentageColorPipe
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  private readonly dashboardService = inject(DashboardService);

  // KPIs mock
  dashboardValues = signal<DashboardResponse | null>(null);
  error = signal<string | null>(null);
  loading = signal<boolean>(false);

  topPerformanceTab = computed<ApexOptions | null>(() => {
    const values = this.dashboardValues();
    if (!values)
      return null;
    if (!values.portfolio.stocks || values.portfolio.stocks.length == 0)
      return null;
    
    return this.builPerformance(values.portfolio.stocks);
  });

  donutLabels = computed<string[] | null>(() => {
    const values = this.dashboardValues();
    if (!values)
      return null;
    if (!values.sectors || values.sectors.length == 0)
      return null;

    return values.sectors.map(i => i.sector);
  })

  donutSeries = computed<ApexNonAxisChartSeries | null>(() => {
    const values = this.dashboardValues();
    if (!values)
      return null;
    if (!values.sectors || values.sectors.length == 0)
      return null;

    return values.sectors.map(sector => +sector.currentPrice.toFixed(2));
  })

  ngOnInit() {
    this.loading.set(true);
    this.dashboardService.loadDashboard()
    .pipe(finalize(() => this.loading.set(false)))
    .subscribe({
      next: res => this.dashboardValues.set(res),
      error: err => this.error.set(Utils.getErrorOrDefault(err, 'Failed to load dashboard'))
    });
  }

  private builPerformance(values: ApiPosition[]): ApexOptions {
    const items = values.sort((a, b) => (b.yield ?? 0) - (a.yield ?? 0)).slice(0, 5);

    const categories = items.map(i => i.symbol);
    const data = items.map(i => +((i.yield ?? 0) * 100).toFixed(2));

    return {
      dataLabels: {
        enabled: true,
        formatter: (entry: number) => `${(entry ?? 0).toFixed(2)}%`,
        style: { colors: ['#fff'] },
      },
      xaxis: { categories },
      series: [{ name: 'Performance', data }],
    };
  }
}





