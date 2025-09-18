export const API_ROUTES = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    checkAuth: '/auth/checkAuth',
  },
  transaction: {
    root: '/transaction',
  },
  portfolio: {
    root: '/portfolio',
  },
  user : {
    getMe : '/user'
  },
  stock: {
    root: '/stock',
    stockBySymbol: (symbol: string) => `/stock/${encodeURIComponent(symbol)}`,
  }
} as const;
