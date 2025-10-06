export interface Position {
  symbol: string;
  name: string;
  volume: number;
  boughtPrice: number;
  currentPrice: number | null;
  yield: number | null;
  part: number | null;
}
