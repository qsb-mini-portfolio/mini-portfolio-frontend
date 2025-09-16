import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Dashboard } from './dashboard/dashboard';
import { authGuard } from './auth/auth.guard';
import { Register } from './auth/register/register';
import {PortfolioOverview} from './portfolio/ui/portfolio-overview/portfolio-overview';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'portfolio', component: PortfolioOverview},
  { path: 'dashboard', component: Dashboard, canMatch: [authGuard] },
  { path: '**', redirectTo: 'login' },
];
