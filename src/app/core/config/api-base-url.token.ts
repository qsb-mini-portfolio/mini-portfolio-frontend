import { inject, InjectionToken } from "@angular/core";
import { APP_CONFIG } from "./app-config.token";

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => inject(APP_CONFIG).apiBaseUrl
});