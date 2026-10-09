import { Suspense } from 'react'
import { Outlet, ScrollRestoration } from 'react-router'
import { DemoBanner } from './DemoBanner'
import { Footer } from './Footer'
import { Header } from './Header'
import { PageLoader } from './PageLoader'
import { Toaster } from './Toaster'

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Lien d'évitement : permet aux personnes naviguant au clavier de sauter le menu. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:shadow-float"
      >
        Aller au contenu
      </a>
      <DemoBanner />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <Toaster />
      <ScrollRestoration />
    </div>
  )
}
