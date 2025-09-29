import { inject } from '@angular/core';
import { TokenStorage } from './token-storage.service';
import { CanActivateFn, CanActivate, Router } from '@angular/router';
import {AuthService} from './auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const token = inject(TokenStorage).token;
  const router = inject(Router);
  return token ? true : router.createUrlTree(['/login']);
};

export const authRedirectGuard: CanActivateFn = (): Observable<boolean | any> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = inject(TokenStorage).token;
  if (!token) {
    return of(router.createUrlTree(['/login']));
  }
  return authService.checkAuth(token).pipe(
    map(isValid => isValid ? router.createUrlTree(['/dashboard']) : router.createUrlTree(['/login'])),
    catchError(() => of(router.createUrlTree(['/login']))) 
  );
};
