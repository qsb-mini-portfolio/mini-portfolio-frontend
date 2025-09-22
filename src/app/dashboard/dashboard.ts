import {Component, ChangeDetectionStrategy, inject, computed} from '@angular/core';
import {DecimalPipe, NgClass} from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { AvatarModule } from 'primeng/avatar';
import { RippleModule } from 'primeng/ripple';
import { NgApexchartsModule } from 'ng-apexcharts';
import {DashboardService} from '../portfolio/services/dashboard.service';
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
export class Dashboard {
  private readonly api = inject(DashboardService);
  readonly data = this.api.raw;
  readonly loading = this.api.loading;
  readonly error = this.api.error;

  // KPIs mock
  nav = this.api.netValue;
  perfPct = this.api.performancePct;

  readonly sectorChartData= this.api.sectorChartData;

  // ApexCharts — NAV Over Time (area)
  areaSeries = [
    {
      name: 'NAV',
      data: [32, 28, 40, 29, 35, 26, 34, 31, 22, 18, 44, 38],
    },
  ];
  areaOptions: any = {
    chart: { type: 'area', height: 300, toolbar: { show: false }, zoom: { enabled: false } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    colors: ['#6c5ce7'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.25,
        opacityTo: 0.02,
        stops: [0, 80, 100],
      },
    },
    grid: { borderColor: '#243246', strokeDashArray: 3, yaxis: { lines: { show: false } } },
    xaxis: {
      categories: [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OCT',
        'NOV',
        'DEC',
      ],
      labels: { style: { colors: '#7e8aa9' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { show: false } },
    tooltip: { theme: 'dark' },
    legend: { show: false },
  };

  // ApexCharts — Asset Allocation (donut)
  readonly donutSeries = this.api.sectorDonutSeries;
  readonly donutLabels = this.api.sectorDonutLabels;
  donutOptions: any = {
    chart: { type: 'donut', height: 300 },
    dataLabels: { enabled: false },
    colors: ['#ff6aa3', '#6b74ff', '#7b5cff', '#2a3344'],
    stroke: { width: 0 },
    plotOptions: { pie: { donut: { size: '72%' } } },
    legend: { position: 'bottom' },
  };

  sectors = [
    { name: 'Technology', v: 25, color: '#5ad1ff' },
    { name: 'Healthcare', v: 20, color: '#ff7a7a' },
    { name: 'Financials', v: 18, color: '#ffc267' },
    { name: 'Industrials', v: 15, color: '#7bd389' },
    { name: 'Others', v: 22, color: '#8b96b3' },
  ];

  currencies = [
    { code: 'USD', v: 60 },
    { code: 'EUR', v: 25 },
    { code: 'GBP', v: 10 },
    { code: 'JPY', v: 5 },
  ];

  ngOnInit() {
    this.api.load();
  }
}





