import { StockResponse } from "../stock/stockResponse";

export interface Transaction {
    transactionId: string;
    stock: StockResponse;
    price: number;
    volume: number;
    date: string;
}