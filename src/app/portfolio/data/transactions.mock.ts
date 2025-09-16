import { Transaction } from '../models';

export const TRANSACTIONS_SEED: ReadonlyArray<Transaction> = [
  { id: 't1', date: '2024-07-20', symbol: 'ABC', side: 'BUY',  quantity: 50,  price: 145 },
  { id: 't2', date: '2024-07-15', symbol: 'XYZ', side: 'SELL', quantity: 25,  price: 210 },
  { id: 't3', date: '2024-07-10', symbol: 'DEF', side: 'BUY',  quantity: 75,  price: 115 },
  { id: 't4', date: '2024-07-05', symbol: 'GHI', side: 'BUY',  quantity: 100, price: 48  },
  { id: 't5', date: '2024-07-01', symbol: 'JKL', side: 'SELL', quantity: 60,  price: 85  }
] as const;
