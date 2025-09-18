export const API_ROUTES = {
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        checkAuth : '/auth/checkAuth'
    },
    dashboard: {
        root: '/dashboard',
    },
    user : {
        getMe : '/user'
    },
  transaction: {
      root: '/transaction',
    stock: '/transaction/stock',
    stockBySymbol: (symbol: string) => `/transaction/stock/${encodeURIComponent(symbol)}`
  }
} as const;
