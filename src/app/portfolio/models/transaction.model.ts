export type Side = 'BUY' | 'SELL';

export interface Transaction {
    id: string;
    date: string;
    symbol: string;
    side: Side;
    volume: number;
    price: number;
}
