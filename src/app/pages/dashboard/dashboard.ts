import { Component, ChangeDetectionStrategy, inject, computed, signal} from '@angular/core';
import { NgClass} from '@angular/common';

import { finalize } from 'rxjs';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ApexNonAxisChartSeries, ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

import { DashboardService } from '../../services/dashboard/dashboard.service';
import { Utils } from '../../utils/utils';

import { CurrencyOrNonePipe } from '../../utils/pipe/currencyOrNonePipe';
import { PercentageOrNonePipe } from '../../utils/pipe/percentageOrNonePipe';
import { PercentageColorPipe } from '../../utils/pipe/percentageClassPipe';

import { DashboardResponse } from '../../models/dashboard/dashboardResponse';
import { ApiPosition } from '../../models/portfolio/position_old.model';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { PortfolioService } from '../../services/portfolio/portfolio.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    CardModule,
    ButtonModule,
    NgApexchartsModule,
    NgClass,
    CurrencyOrNonePipe,
    PercentageOrNonePipe,
    PercentageColorPipe,
    SelectButtonModule
  ],
  providers: [ CurrencyOrNonePipe ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  private readonly dashboardService = inject(DashboardService);
  private readonly portfolioService = inject(PortfolioService);

  dashboardValues = signal<DashboardResponse | null>(null);
  error = signal<string | null>(null);
  loading = signal<boolean>(false);

  charData = signal<[number, number][]>([]);
  selectedPeriod = signal<string>('5d');

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

  periodOptions = [
    { label: '1D', value: '1d' },
    { label: '5D', value: '5d' },
    { label: '1M', value: '1mo' },
    { label: '6M', value: '6mo' },
    { label: '1Y', value: '1y' },
    { label: '5Y', value: '5y' }
  ];

  intervalMap: Record<string, string> = {
    '1d': '5m',
    '5d': '30m',
    '1mo': '4h',
    '6mo': '1d',
    '1y': '1d',
    '5y': '5d'
  };

  constructor(private currencyOrNonePipe: CurrencyOrNonePipe) {}

  ngOnInit() {
    this.loading.set(true);
    this.loadPortfolioGraph();
    this.dashboardService.loadDashboard()
    .pipe(finalize(() => this.loading.set(false)))
    .subscribe({
      next: res => this.dashboardValues.set(res),
      error: err => this.error.set(Utils.getErrorOrDefault(err, 'Failed to load dashboard'))
    });
  }

  yAxisLabelFormatter = (value: number | string) => {
    const numericValue = Number(value);
    if (isNaN(numericValue)) {
      return '-';
    }
    return this.currencyOrNonePipe.transform(numericValue);
  };

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

  public tooltipOptions: any = {
    theme: 'dark',
    style: { fontSize: '14px' },
    custom: (opts: any) => {
      const label = opts?.w?.globals?.labels?.[opts.seriesIndex] ?? 'Unknown';
      const value = opts?.series?.[opts.seriesIndex] ?? 0;
      return `
        <div style="
          color: #ffffff !important;
          background: rgba(0,0,0,0.85) !important;
          padding: 8px 10px;
          border-radius: 6px;
          font-size: 14px;
          line-height: 1.2;
          box-shadow: 0 4px 10px rgba(0,0,0,0.4);
        ">
          <div style="font-weight:600; margin-bottom:4px;">${label}</div>
          <div>${this.yAxisLabelFormatter(value)}</div>
        </div>
      `;
    }
  };

  selectPeriod(period: string) {
    if (!period) return;
    this.selectedPeriod.set(period);
    this.loadPortfolioGraph();
  }

  loadPortfolioGraph() {
    this.portfolioService.getPortfolioGraph(this.selectedPeriod(), this.intervalMap[this.selectedPeriod()])
    .subscribe({
      next: (resp) => {
        const timestampedData = this.generateTimestampedData(resp.prices.reverse(), this.intervalMap[this.selectedPeriod()]);
        this.charData.set(timestampedData);
      },
      error: (err) => console.error("Unable to retrieve portfolio graph")
    })
  }

  private generateTimestampedData(prices: number[], period: string): [number, number][] {
    const now = Date.now();
    const periodMs = Utils.intervalToMs(period);
    const start = now - periodMs;
    const intervalMs = periodMs / (prices.length - 1);

    return prices.map((price, idx) => {
        const timestamp = start + idx * intervalMs;
        return [timestamp, price];
    });
  }
}





