export interface ApiTransactionPage {
  items: ApiTransaction[];
  page: number;
  totalElements: number;
}

export interface ApiTransaction {
  transactionId: string;
  stock: {
    stockId: string;
    symbol: string;
    name: string;
  };
  price: number;
  volume: number;
  date: string;
}
