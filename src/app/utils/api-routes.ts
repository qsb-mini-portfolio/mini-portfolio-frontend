export const API_ROUTES = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    checkAuth: '/auth/checkAuth',
  },
  transaction: {
    root: '/transaction',
    import: '/transaction/import',
  },
  portfolio: {
    root: '/portfolio',
    dashboard: '/portfolio/dashboard',
  },
  user : {
    getMe : '/user',
    changeEmail :'/user/email',
    favoriteStock : '/user/favoriteStock',
    changeProfilePicture : '/user/profilePicture'
  },
  stock: {
    root: '/stock',
    graph: '/stock/graph',
    stockBySymbol: (symbol: string) => `/stock/${encodeURIComponent(symbol)}`,
  },
  demo: {
    root: '/demo',
  }
} as const;
