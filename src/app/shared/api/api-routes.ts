export const API_ROUTES = {
    auth: {
        login: '/api/auth/login',
        register: '/api/auth/register',
    },
    dashboard: {
        root: '/api/dashboard',
    },
    user : {
        getMe : '/user/'
    },
  transaction: {
      root: '/transaction',
    stock: '/transaction/stock',
    stockBySymbol: (symbol: string) => `/transaction/stock/${encodeURIComponent(symbol)}`
  }
} as const;
