export interface UiTransaction {
  id: string;
  dateIso: string;
  side: string;
  symbol: string;
  name: string;
  price: number;
  volume: number;
  amount: number;
}
