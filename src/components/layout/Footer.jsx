import { Link } from 'react-router'
import { MAIN_NAV, SECONDARY_NAV } from '../../app/routes'
import { Container } from '../ui/Container'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-charcoal/10 bg-white">
      <Container className="grid gap-10 py-12 md:grid-cols-3">
        <div>
          <p className="font-serif text-xl">AURA Studio</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-sage-deep">
            Soins, rituels et consultations. Une marque fictive imaginée pour un portfolio.
          </p>
        </div>

        <nav aria-label="Liens du pied de page" className="md:col-span-2">
          <ul className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            {[...MAIN_NAV, ...SECONDARY_NAV].map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="hover:text-terracotta-deep hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <div className="border-t border-charcoal/10">
        <Container className="py-6 text-xs leading-relaxed text-sage-deep">
          AURA Studio est un projet de démonstration réalisé à des fins de portfolio. Les produits,
          prix, avis et personnes présentés sont fictifs. Les recommandations de l'assistant sont
          simulées et ne constituent pas un avis médical.
        </Container>
      </div>
    </footer>
  )
}
