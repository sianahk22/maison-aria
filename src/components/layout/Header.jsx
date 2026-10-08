import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { MAIN_NAV, ROUTES, SECONDARY_NAV } from '../../app/routes'
import { Container } from '../ui/Container'

// NavLink ajoute automatiquement aria-current="page" sur le lien de la page active.
function navLinkClass({ isActive }) {
  return `text-sm transition-colors hover:text-terracotta-deep ${
    isActive ? 'text-terracotta-deep underline underline-offset-8' : 'text-charcoal'
  }`
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b border-charcoal/10 bg-ivory/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link to={ROUTES.home} className="font-serif text-2xl tracking-wide" onClick={closeMenu}>
          AURA <span className="text-terracotta-deep">Studio</span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {MAIN_NAV.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={navLinkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <NavLink to={ROUTES.account} className={(s) => `hidden md:inline ${navLinkClass(s)}`}>
            Mon espace
          </NavLink>
          <NavLink to={ROUTES.cart} className={navLinkClass}>
            Panier
          </NavLink>

          <button
            type="button"
            className="rounded-full border border-charcoal/20 px-4 py-2 text-sm md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            onKeyDown={(event) => event.key === 'Escape' && closeMenu()}
          >
            {menuOpen ? 'Fermer' : 'Menu'}
          </button>
        </div>
      </Container>

      {menuOpen && (
        <nav id="mobile-menu" aria-label="Navigation mobile" className="border-t border-charcoal/10 md:hidden">
          <Container>
            <ul className="flex flex-col py-4">
              {[...MAIN_NAV, ...SECONDARY_NAV].map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={(s) => `block py-3 text-base ${navLinkClass(s)}`}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </Container>
        </nav>
      )}
    </header>
  )
}
