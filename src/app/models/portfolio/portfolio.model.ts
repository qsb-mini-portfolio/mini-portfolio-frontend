import { Position } from "./position.model";

export interface Portfolio {
    stocks: Position[];
    currentPrice: number;
    boughtPrice: number;
    yield: string | number;
}