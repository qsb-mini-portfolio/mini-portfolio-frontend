export interface ApiPosition {
  symbol: string;
  name: string;
  volume: number;
  boughtPrice: number;
  currentPrice: number | null;
  yield: number | null;
  part: number | null;
}

export interface ApiPositionResponse {
  stocks: ApiPosition[];
  currentPrice: number;
  boughtPrice: number;
  yield: string | number;
}


export interface UiPosition {
  symbol: string;
  name: string;
  volume: number;
  currentPrice?: number;
  marketValue?: number;
  weightPct?: number;
  avgCost?: number;
  boughtPrice: number;
}
