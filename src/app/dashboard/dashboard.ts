import {Component, ChangeDetectionStrategy, inject, computed, OnInit} from '@angular/core';
import {DecimalPipe, NgClass} from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { AvatarModule } from 'primeng/avatar';
import { RippleModule } from 'primeng/ripple';
import {ApexOptions, NgApexchartsModule} from 'ng-apexcharts';
import {DashboardService} from '../portfolio/services/dashboard.service';
import {ApiDashboardResponse} from '../portfolio/models/dashboard.model';
@Component({
  selector: 'app-dashboard',
  standalone: true,

  imports: [
    DecimalPipe,
    CardModule,
    ButtonModule,
    TagModule,
    DividerModule,
    ProgressBarModule,
    AvatarModule,
    RippleModule,
    NgApexchartsModule,
    NgClass,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private readonly api = inject(DashboardService);
  readonly data = this.api.raw;
  readonly loading = this.api.loading;
  readonly error = this.api.error;

  // KPIs mock
  nav = this.api.netValue;
  perfPct = this.api.performancePct;

  // ApexCharts — Asset Allocation (donut)
  readonly donutSeries = this.api.sectorDonutSeries;
  readonly donutLabels = this.api.sectorDonutLabels;
  donutOptions: any = {
    chart: { type: 'donut', height: 300, foreColor: "#fff" },
    dataLabels: { enabled: false },
    colors: ['#2374ab', '#231651', '#4dccbd', '#ff8484'],
    stroke: { width: 0 },
    plotOptions: { pie: { donut: { size: '72%' } } },
    legend: { position: 'bottom' },
  };

  readonly top5PerfOptions = computed<ApexOptions>(() => {
    const raw = this.api.raw();
    if (!raw || !raw.portfolio?.stocks?.length) return this.getDefaultTop5PerfOptions();
    return this.buildTop5PerfOptions(raw);
  });

  private getDefaultTop5PerfOptions(): any {
    return {
      chart: { type: 'bar', height: 350, foreColor: '#fff' },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
          colors: {
            ranges: [
              { from: -1000, to: 0, color: '#FF6B6B' },
              { from: 0, to: 1000, color: '#4ECDC4' },
            ],
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (v: number) => `${(v ?? 0).toFixed(2)}%`,
        style: { colors: ['#fff'] },
      },
      xaxis: { categories: [] },
      yaxis: { labels: { style: { colors: '#fff' } } },
      legend: { show: false },
      series: [{ name: 'Performance', data: [] }],
    };
  }
  private buildTop5PerfOptions(resp: ApiDashboardResponse): any {
    const stocks = resp.portfolio?.stocks ?? [];
    const items = stocks
      .filter(s => s?.yield !== null && Number.isFinite(Number(s.yield)))
      .map(s => ({
        symbol: s.symbol,
        name: s.name,
        perfPct: Number(s.yield) * 100,
        boughtPrice: s.boughtPrice ?? 0,
        currentPrice: s.currentPrice ?? 0,
        volume: s.volume ?? 0,
      }))
      .sort((a, b) => b.perfPct - a.perfPct)
      .slice(0, 5);

    const categories = items.map(i => i.symbol);
    const data = items.map(i => +i.perfPct.toFixed(2));

    return {
      chart: { type: 'bar', height: 350, foreColor: '#fff' },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
          colors: {
            ranges: [
              { from: -1000, to: 0, color: '#FF6B6B' },
              { from: 0, to: 1000, color: '#4ECDC4' },
            ],
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (v: number) => `${(v ?? 0).toFixed(2)}%`,
        style: { colors: ['#fff'] },
      },
      xaxis: { categories },
      // labels NVDA/AAPL… en blanc (axe Y car bar horizontal)
      yaxis: { labels: { style: { colors: '#fff' } } },
      legend: { show: false },
      series: [{ name: 'Performance', data }],
    };
  }

  ngOnInit() {
    this.api.load();
  }
}





