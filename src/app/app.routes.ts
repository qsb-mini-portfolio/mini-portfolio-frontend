import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { UserPage } from './pages/user/userPage';
import { Component } from '@angular/core';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { authRedirectGuard, authGuard } from './services/auth/auth.guard';
import { PortfolioOverview } from './pages/portfolio/portfolio-overview';
import { Demo } from './pages/demo/demo';
import { Stocks } from './pages/stock/stocks';

@Component({
  selector: 'app-redirect',
  template: ''
})
export class RedirectComponent {}

export const routes: Routes = [
  { path: '', component: RedirectComponent, canActivate: [authRedirectGuard], pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'demo', component: Demo },
  { path: 'portfolio', component: PortfolioOverview, canMatch: [authGuard]},
  { path: 'dashboard', component: Dashboard, canMatch: [authGuard] },
  { path: 'stocks', component: Stocks, canMatch: [authGuard] },
  { path: 'userPage', component: UserPage,  canMatch: [authGuard]},
  { path: '**', redirectTo: 'login' },
];
