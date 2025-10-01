export type Side = 'BUY' | 'SELL';

export interface Transaction {
    id: string;
    date: string;
    symbol: string;
    side: Side;
    volume: number;
    price: number;
}

export interface CreateTransactionRequest {
  stockId: string;
  price: number;
  volume: number;
  date: string;
}

export interface CreateStockRequest {
  symbol: string;
  name?: string;
}

export interface DeleteTransactionResponse{
  message : string;
}