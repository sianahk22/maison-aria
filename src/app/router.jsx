import { createBrowserRouter } from 'react-router'
import { RootLayout } from '../components/layout/RootLayout'
import { AccountPage } from '../pages/AccountPage'
import { AdminPage } from '../pages/AdminPage'
import { BookingPage } from '../pages/BookingPage'
import { CartPage } from '../pages/CartPage'
import { ConciergePage } from '../pages/ConciergePage'
import { ErrorPage } from '../pages/ErrorPage'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ProductPage } from '../pages/ProductPage'
import { ShopPage } from '../pages/ShopPage'
import { ROUTES } from './routes'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: ROUTES.home, element: <HomePage /> },
      { path: ROUTES.shop, element: <ShopPage /> },
      { path: ROUTES.product(':slug'), element: <ProductPage /> },
      { path: ROUTES.cart, element: <CartPage /> },
      { path: ROUTES.booking, element: <BookingPage /> },
      { path: ROUTES.concierge, element: <ConciergePage /> },
      { path: ROUTES.account, element: <AccountPage /> },
      { path: ROUTES.admin, element: <AdminPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
