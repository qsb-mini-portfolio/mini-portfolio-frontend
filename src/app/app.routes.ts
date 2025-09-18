import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Dashboard } from './dashboard/dashboard';
import { UserPage } from './userPage/userPage';
import { authGuard, authRedirectGuard } from './auth/auth.guard';
import { Register } from './auth/register/register';
import {PortfolioOverview} from './portfolio/ui/portfolio-overview/portfolio-overview';
import { Component } from '@angular/core';

@Component({
  selector: 'app-redirect',
  template: ''
})
export class RedirectComponent {}

export const routes: Routes = [
  { path: '', component: RedirectComponent, canActivate: [authRedirectGuard], pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'portfolio', component: PortfolioOverview, canMatch: [authGuard]},
  { path: 'dashboard', component: Dashboard, canMatch: [authGuard] },
  { path: 'userPage', component: UserPage,  canMatch: [authGuard]},
  { path: '**', redirectTo: 'login' },
];
