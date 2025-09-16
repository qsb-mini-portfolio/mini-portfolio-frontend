import {Position, Transaction} from '../models';
import {Injectable, Signal} from '@angular/core';

export abstract class TransactionsRepository {
  abstract readonly transactions: Signal<readonly Transaction[]>
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

export function buildPositions(
  txs: readonly Transaction[],
  names: Record<string, string>,
  prices: Record<string, number>
): Position[] {
  const bySymbol = new Map<string, number>();
  for (const t of txs) {
    const qty = t.side === 'BUY' ? t.quantity : -t.quantity;
    bySymbol.set(t.symbol, (bySymbol.get(t.symbol) ?? 0) + qty);
  }
  const list: Position[] = [];
  bySymbol.forEach((qty, sym) => {
    if (qty === 0) return;
    const price = prices[sym] ?? 0;
    list.push({
      symbol: sym,
      name: names[sym] ?? sym,
      quantity: qty,
      currentPrice: price,
      marketValue: qty * price,
      weightPct: 0
    });
  });
  const total = list.reduce((s,p)=>s+p.marketValue, 0) || 1;
  list.forEach(p => p.weightPct = (p.marketValue / total) * 100);
  return list.sort((a,b) => b.marketValue - a.marketValue);
}
