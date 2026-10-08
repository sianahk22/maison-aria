// Source unique des chemins de l'application : le routeur, le menu et le pied de page
// s'appuient sur ces constantes pour éviter les URL écrites en dur un peu partout.
export const ROUTES = {
  home: '/',
  shop: '/boutique',
  product: (slug) => `/boutique/${slug}`,
  cart: '/panier',
  booking: '/reservation',
  concierge: '/concierge',
  account: '/compte',
  admin: '/admin',
}

export const MAIN_NAV = [
  { to: ROUTES.shop, label: 'Boutique' },
  { to: ROUTES.booking, label: 'Réservation' },
  { to: ROUTES.concierge, label: 'AURA Concierge' },
]

export const SECONDARY_NAV = [
  { to: ROUTES.account, label: 'Espace cliente' },
  { to: ROUTES.admin, label: 'Administration' },
]
