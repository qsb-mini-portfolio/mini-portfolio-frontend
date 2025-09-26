export  interface stockResponse {
    stockId : string;
    symbol : string;
    name : string;
    type : string;
    price : Float32Array;
}

export interface favoriteStockResponse {
  stocks: stockResponse[];
}