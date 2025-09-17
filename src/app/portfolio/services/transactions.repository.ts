import {Position, Transaction, UiTransaction} from '../models';
import {inject, Injectable, signal, Signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_BASE_URL} from '../../core/config/api-base-url.token';
import {API_ROUTES} from '../../shared/api/api-routes';

export abstract class TransactionsRepository {
  abstract readonly transactions: Signal<readonly UiTransaction[]>
  abstract readonly loading: Signal<boolean>;
  abstract readonly error: Signal<string | null>;
  abstract refresh(params?: { page?: number; size?: number}): void;
  abstract add(tx: Omit<Transaction, 'id'>): void;
  abstract clear(): void;
}
