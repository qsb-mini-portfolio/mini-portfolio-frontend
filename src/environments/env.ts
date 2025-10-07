export interface Env {
  production: boolean;
  apiUrl: string;
}

export const env: Env = {
  production: true,
  apiUrl: (window as any)?.env?.API_URL ?? 'http://localhost:8080'
};
