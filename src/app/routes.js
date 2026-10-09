// Source unique des chemins : le routeur, les menus et les liens s'appuient sur ces constantes.
export const ROUTES = {
  home: '/',
  shop: '/shop',
  product: (productId) => `/shop/${productId}`,
  booking: '/booking',
  concierge: '/concierge',
  cart: '/cart',
  account: '/account',
  admin: '/admin',
  notFound: '/404',
}

export const MAIN_NAV = [
  { to: ROUTES.shop, label: 'Collection' },
  { to: ROUTES.concierge, label: 'ARIA Concierge' },
  { to: ROUTES.booking, label: 'Consultations' },
]

export const SECONDARY_NAV = [
  { to: ROUTES.account, label: 'Mon espace' },
  { to: ROUTES.admin, label: 'Tableau de bord' },
]
