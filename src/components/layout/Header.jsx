import { useState } from 'react'
import { NavLink } from 'react-router'
import { MAIN_NAV, ROUTES, SECONDARY_NAV } from '../../app/routes'
import { countItems } from '../../features/cart/cartLogic'
import { cartStore } from '../../features/cart/cartStore'
import { useStore } from '../../lib/useStore'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Logo } from './Logo'

// NavLink ajoute automatiquement aria-current="page" sur le lien de la page active.
const navLinkClass = ({ isActive }) =>
  `relative py-2 text-sm transition-colors hover:text-terracotta-deep ${
    isActive ? 'text-terracotta-deep' : 'text-ink'
  }`

function CartLink({ onClick }) {
  const { items } = useStore(cartStore)
  const count = countItems(items)

  return (
    <NavLink
      to={ROUTES.cart}
      onClick={onClick}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-sand"
    >
      <Icon name="bag" />
      <span className="sr-only">Panier, {count} article{count > 1 ? 's' : ''}</span>
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute top-1 right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta-deep px-1 text-[11px] font-semibold text-white"
        >
          {count}
        </span>
      )}
    </NavLink>
  )
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      className="sticky top-0 z-40 border-b border-ink/5 bg-ivory/90 backdrop-blur-md"
      onKeyDown={(event) => event.key === 'Escape' && closeMenu()}
    >
      <Container className="flex h-18 items-center justify-between gap-4">
        <Logo onClick={closeMenu} />

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {MAIN_NAV.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={navLinkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <NavLink
            to={ROUTES.account}
            className="hidden h-11 w-11 items-center justify-center rounded-full hover:bg-sand lg:inline-flex"
          >
            <Icon name="user" />
            <span className="sr-only">Mon espace</span>
          </NavLink>
          <CartLink onClick={closeMenu} />
          {/* Le conteneur gère l'affichage : `hidden` sur le bouton entrerait en conflit avec son `inline-flex`. */}
          <div className="ml-2 hidden sm:block">
            <ButtonLink to={ROUTES.booking} size="sm">
              Prendre rendez-vous
            </ButtonLink>
          </div>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-sand lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} />
            <span className="sr-only">{menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}</span>
          </button>
        </div>
      </Container>

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Navigation mobile"
          className="animate-fade-up border-t border-ink/5 bg-ivory lg:hidden"
        >
          <Container className="py-4">
            <ul className="flex flex-col">
              {[...MAIN_NAV, ...SECONDARY_NAV].map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `block border-b border-ink/5 py-4 font-serif text-2xl ${
                        isActive ? 'text-terracotta-deep' : 'text-ink'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <ButtonLink to={ROUTES.booking} onClick={closeMenu} className="mt-6 w-full sm:hidden">
              Prendre rendez-vous
            </ButtonLink>
          </Container>
        </nav>
      )}
    </header>
  )
}
