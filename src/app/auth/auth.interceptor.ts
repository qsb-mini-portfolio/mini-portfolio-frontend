import { inject } from '@angular/core';
import { env } from '../../environments/env';
import { TokenStorage } from './token-storage.service';
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(TokenStorage);
  const token = store.token;

  const url = new URL(req.url, location.origin);
  const isAuthCall =
    url.pathname.endsWith(env.endpoints.login) || url.pathname.endsWith(env.endpoints.register);

  if (token && !isAuthCall) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req);
};
