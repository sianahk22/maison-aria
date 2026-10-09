import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'
import { RootLayout } from '../components/layout/RootLayout'
import { ErrorPage } from '../pages/ErrorPage'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { RouteErrorPage } from '../pages/RouteErrorPage'
import { ROUTES } from './routes'

// Chargement à la demande : le code d'une page n'est téléchargé que lorsqu'on la visite.
// En attendant, le <Suspense> de RootLayout affiche un squelette sous l'en-tête.
const lazyPage = (load, exportName) => lazy(async () => ({ default: (await load())[exportName] }))

const ShopPage = lazyPage(() => import('../pages/ShopPage'), 'ShopPage')
const ProductPage = lazyPage(() => import('../pages/ProductPage'), 'ProductPage')
const BookingPage = lazyPage(() => import('../pages/BookingPage'), 'BookingPage')
const ConciergePage = lazyPage(() => import('../pages/ConciergePage'), 'ConciergePage')
const CartPage = lazyPage(() => import('../pages/CartPage'), 'CartPage')
const AccountPage = lazyPage(() => import('../pages/AccountPage'), 'AccountPage')
const AdminPage = lazyPage(() => import('../pages/AdminPage'), 'AdminPage')

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    ErrorBoundary: ErrorPage,
    children: [
      {
        // Frontière d'erreur interne : une page en erreur s'affiche sous l'en-tête, qui reste utilisable.
        // ErrorPage (ci-dessus) ne sert qu'en dernier recours, si le gabarit lui-même échoue.
        ErrorBoundary: RouteErrorPage,
        children: [
          { path: ROUTES.home, Component: HomePage },
          { path: ROUTES.shop, Component: ShopPage },
          { path: ROUTES.product(':productId'), Component: ProductPage },
          { path: ROUTES.booking, Component: BookingPage },
          { path: ROUTES.concierge, Component: ConciergePage },
          { path: ROUTES.cart, Component: CartPage },
          { path: ROUTES.account, Component: AccountPage },
          { path: ROUTES.admin, Component: AdminPage },
          { path: ROUTES.notFound, Component: NotFoundPage },
          { path: '*', Component: NotFoundPage },
        ],
      },
    ],
  },
])
