import {Position, Transaction, UiTransaction} from '../models';
import {Injectable, Signal} from '@angular/core';

export abstract class TransactionsRepository {
  abstract readonly transactions: Signal<readonly UiTransaction[]>
  abstract readonly loading: Signal<boolean>;
  abstract readonly error: Signal<string | null>;
  abstract refresh(params?: { page?: number; size?: number}): void;
  abstract add(tx: Omit<Transaction, 'id'>): void;
  abstract clear(): void;
}

@Injectable({ providedIn: 'root'})
export class PricingCatalog {
  readonly instrumentNames: Record<string, string> = {
    ABC: 'Tech Innovators Inc.',
    XYZ: 'GlobalEnergy Corp.',
    DEF: 'Health Solutions Ltd.',
    GHI: 'Consumer Goods PLC',
    JKL: 'Financial Services Group'
  };
  readonly currentPrices: Record<string, number> = { ABC:150, XYZ:200, DEF:120, GHI:50, JKL:80 };
}
