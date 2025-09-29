import {
  APP_INITIALIZER,
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from '../../app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../../services/auth/auth.interceptor';
import { APP_CONFIG, AppConfig } from './app-config.token';
import { API_BASE_URL } from './api-base-url.token';
import { firstValueFrom } from 'rxjs';
import { env } from '../../../environments/env';


function loadConfig() {
  const http = inject(HttpClient);
  return () =>
    firstValueFrom(http.get<AppConfig>('assets/config.json'))
      .then(cfg => (window as any).__APP_CFG__ = cfg)
      .catch(() => {
        // fallback si le fichier n'existe pas ou erreur réseau
        (window as any).__APP_CFG__ = { apiBaseUrl: env.apiUrl } satisfies AppConfig;
      });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          dark: true,
          primary: { 500: '#6c5ce7', 600: '#5345d9' },
        },
      },
    }),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: APP_INITIALIZER, useFactory: loadConfig, multi: true },
    {
      provide: APP_CONFIG,
      useFactory: () => {
        const cfg = (window as any).__APP_CFG__ as Partial<AppConfig> | undefined;
        if (!cfg || !cfg.apiBaseUrl) {
          return { apiBaseUrl: env.apiUrl } as AppConfig;
        }
        return { apiBaseUrl: cfg.apiBaseUrl } as AppConfig;
      },
    },
    { provide: API_BASE_URL, useFactory: () => (window as any).__APP_CFG__?.apiBaseUrl || env.apiUrl }
  ],
};
