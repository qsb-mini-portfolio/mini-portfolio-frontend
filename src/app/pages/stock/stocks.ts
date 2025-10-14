import { FormsModule } from '@angular/forms';
import { Component, ChangeDetectionStrategy, inject, signal} from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SelectButtonModule } from 'primeng/selectbutton';

import { StockResponse } from '../../models/stock/stockResponse';
import { StocksService } from '../../services/stock/stocks.service';
import { Utils } from '../../utils/utils';
import { CurrencyOrNonePipe } from '../../utils/pipe/currencyOrNonePipe';


@Component({
  selector: 'app-stocks',
  standalone: true,
  imports: [
    FormsModule,
    CardModule,
    ButtonModule,
    AutoCompleteModule,
    SelectButtonModule,
    ChartComponent
  ],
  providers: [ CurrencyOrNonePipe ],
  templateUrl: './stocks.html',
  styleUrls: ['./stocks.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Stocks {
  stocksService = inject(StocksService);

  loading = signal<boolean>(false);
  canAdd = signal<boolean>(false);
  stocks: StockResponse[] = [];
  lastQuery = signal<string>('');
  filteredStock = signal<StockResponse[]>([]);
  selectStocks: StockResponse | null = null;
  selectedPeriod = signal<string>('5d');

  charData = signal<[number, number][]>([]);

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
    this.loadStocks();
  }

  loadStocks() {
    this.loading.set(true);
    this.stocksService.loadStocks().subscribe({
      next: (resp) => { 
        this.loading.set(false);
        this.stocks = resp;
        this.filteredStock.set([]);
       },
      error: (err) => console.error('Unable to load stocks')
    })
  }

  onSearch(event: any) {
    let query = this.lastQuery();
    if (event.originalEvent instanceof InputEvent) {
      query = event.query?.toLowerCase() || '';
      this.lastQuery.set(query);
      this.canAdd.set(query != '' && !this.stocks.some(stock => stock.symbol.toLowerCase() === query.toLowerCase()))
    }
    const filtered = this.stocks.filter(
      s => s.name.toLowerCase().includes(query) || s.symbol.toLowerCase().includes(query)
    );
    this.filteredStock.set(filtered);
  }

  onPick(event: any) {
    this.filteredStock.set([]);
    this.selectStocks = event.value;
    this.loadStockGraph();
  }

  onDropdownClick() {
    this.filteredStock.set([...this.filteredStock()]);
  }

  createNewStock() {
    this.canAdd.set(false);
    this.loading.set(true);
    this.stocksService.createStock(this.lastQuery(), this.lastQuery()).subscribe({
      next: (resp) => this.loadStocks(),
      error: (err) => console.error('Unable to create new stock')
    })
  }

  selectPeriod(period: string) {
    if (!period) return;
    this.selectedPeriod.set(period);
    this.loadStockGraph();
  }

  loadStockGraph() {
    if (!this.selectStocks) return;
    this.stocksService.getStockPriceGraph(this.selectStocks.symbol, this.selectedPeriod(), this.intervalMap[this.selectedPeriod()])
    .subscribe({
      next: (resp) => {
        const timestampedData = this.generateTimestampedData(resp.prices, this.selectedPeriod());
        this.charData.set(timestampedData);
      },
      error: (err) => console.error("Unable to retrieve stock price graph")
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

  yAxisLabelFormatter = (value: number) => {
    return this.currencyOrNonePipe.transform(value);
  };

  
}





