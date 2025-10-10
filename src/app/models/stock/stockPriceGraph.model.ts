export interface StockPriceGraph {
  ticker: string;
  period: string;
  interval: string;
  prices: number[];
}