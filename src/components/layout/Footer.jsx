import { Link } from 'react-router'
import { BRAND, DEMO_LABEL } from '../../app/brand'
import { MAIN_NAV, ROUTES, SECONDARY_NAV } from '../../app/routes'
import { Container } from '../ui/Container'
import { Logo } from './Logo'

const FOOTER_LINKS = [{ to: ROUTES.cart, label: 'Panier' }, ...MAIN_NAV, ...SECONDARY_NAV]

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-ivory">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr]">
        <div>
          <Logo inverted />
          <p className="mt-6 max-w-sm font-serif text-2xl leading-snug">{BRAND.slogan}</p>
        </div>

        <nav aria-label="Liens du pied de page">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {FOOTER_LINKS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-ivory/85 hover:text-white hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <div className="border-t border-ivory/15">
        <Container className="flex flex-col gap-2 py-6 text-xs leading-relaxed text-ivory/75 md:flex-row md:justify-between">
          <p className="font-semibold text-ivory">{DEMO_LABEL}</p>
          <p className="max-w-2xl md:text-right">
            Maison Aria est une marque fictive. Produits, prix, consultants et chiffres sont inventés.
            Aucun paiement, aucun rendez-vous réel, aucune IA connectée. Photos d'illustration Unsplash.
          </p>
        </Container>
      </div>
    </footer>
  )
}
