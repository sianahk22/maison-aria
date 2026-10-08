import { ROUTES } from '../app/routes'
import { Badge } from '../components/ui/Badge'
import { ButtonLink } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'

const HIGHLIGHTS = [
  {
    title: 'La boutique',
    text: 'Sérums, huiles et rituels, filtrés selon votre type de peau et vos envies.',
    to: ROUTES.shop,
    cta: 'Découvrir les soins',
  },
  {
    title: 'Les consultations',
    text: 'Réservez un diagnostic en studio ou en visio, sur un créneau réellement disponible.',
    to: ROUTES.booking,
    cta: 'Réserver',
  },
  {
    title: 'AURA Concierge',
    text: 'Un assistant qui vous oriente vers les soins du catalogue adaptés à votre routine.',
    to: ROUTES.concierge,
    cta: 'Demander conseil',
  },
]

export function HomePage() {
  return (
    <>
      <title>AURA Studio — Projet de démonstration</title>

      <section aria-labelledby="hero-title" className="border-b border-charcoal/10">
        <Container className="py-20 sm:py-28">
          <Badge tone="gold">Projet de démonstration</Badge>
          <h1 id="hero-title" className="mt-6 max-w-3xl font-serif text-5xl leading-tight sm:text-7xl">
            Le soin, pensé comme un rituel.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-charcoal/80">
            Soins, consultations et conseils personnalisés, réunis dans un même studio.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink to={ROUTES.shop} size="lg">
              Explorer la boutique
            </ButtonLink>
            <ButtonLink to={ROUTES.booking} size="lg" variant="secondary">
              Réserver une consultation
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section aria-labelledby="highlights-title">
        <Container className="py-16">
          <h2 id="highlights-title" className="font-serif text-3xl">
            L'expérience AURA
          </h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {HIGHLIGHTS.map((item) => (
              <Card as="li" key={item.title} className="flex flex-col gap-4">
                <h3 className="font-serif text-2xl">{item.title}</h3>
                <p className="flex-1 leading-relaxed text-charcoal/80">{item.text}</p>
                <ButtonLink to={item.to} variant="ghost" className="self-start px-0">
                  {item.cta} →
                </ButtonLink>
              </Card>
            ))}
          </ul>
        </Container>
      </section>
    </>
  )
}
