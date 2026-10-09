import { Suspense } from 'react'
import { Link } from 'react-router'
import { BRAND } from '../../app/brand'
import { ROUTES } from '../../app/routes'
import { Badge } from '../../components/ui/Badge'
import { ButtonLink } from '../../components/ui/Button'
import { Container } from '../../components/ui/Container'
import { Icon } from '../../components/ui/Icon'
import { SmartImage } from '../../components/ui/SmartImage'
import { CONSULTATION_TYPES } from '../../data/consultations'
import { sceneImages } from '../../data/images'
import { formatPrice } from '../../lib/format'
import { useNow } from '../../lib/useNow'
import { findConsultant, findNextAvailableSlots } from '../booking/availability'
import { formatLongDate, formatTime } from '../booking/time'
import { useBookings } from '../booking/useBookings'
import { ProductCard } from '../products/ProductCard'
import { useProducts } from '../products/useProducts'

function SectionHeading({ eyebrow, title, id, children }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-medium tracking-[0.25em] text-terracotta-deep uppercase">{eyebrow}</p>
      <h2 id={id} className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
        {title}
      </h2>
      {children && <p className="mt-4 text-lg leading-relaxed text-stone-deep">{children}</p>}
    </div>
  )
}

function useNextSlots(limit) {
  const bookings = useBookings()
  const now = useNow()
  return findNextAvailableSlots({ consultationTypeId: 'decouverte', bookings, now, limit })
}

// ── 1. Hero ─────────────────────────────────────────────────────────────────
export function HeroSection() {
  const [nextSlot] = useNextSlots(1)

  return (
    <section aria-labelledby="hero-title">
      <Container className="grid items-center gap-12 pt-8 pb-16 sm:pt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-24">
        <div className="animate-fade-up">
          <p className="text-xs font-medium tracking-[0.25em] text-terracotta-deep uppercase">
            {BRAND.name} · Mobilier & décoration
          </p>
          <h1 id="hero-title" className="mt-5 font-serif text-5xl leading-[1.05] sm:text-7xl">
            {BRAND.slogan}
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-stone-deep">{BRAND.taglines[0]}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to={ROUTES.shop} size="lg">
              Découvrir la collection
              <Icon name="arrowRight" className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink to={ROUTES.concierge} size="lg" variant="secondary">
              <Icon name="sparkle" className="h-4 w-4" />
              Parler à l’assistant
            </ButtonLink>
          </div>
          <p className="mt-8 text-xs text-stone-deep">Projet personnel de démonstration — Aura Studio. Marque fictive.</p>
        </div>

        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] sm:aspect-[5/6]">
            <SmartImage image={sceneImages.hero} ratio={1.2} priority sizes="(min-width: 1024px) 45vw, 100vw" />
          </div>

          {/* Carte flottante : information calculée en direct dans la démo, pas une statistique inventée. */}
          <div className="absolute right-4 -bottom-8 left-4 rounded-3xl bg-white/95 p-5 shadow-float backdrop-blur sm:right-auto sm:-left-8 sm:max-w-xs">
            <p className="flex items-center gap-2 text-xs text-stone-deep">
              <Icon name="calendar" className="h-4 w-4" />
              Prochain créneau disponible · démonstration
            </p>
            {nextSlot ? (
              <>
                <p className="mt-2 font-serif text-2xl leading-tight first-letter:uppercase">
                  {formatLongDate(nextSlot.start)}, {formatTime(nextSlot.start)}
                </p>
                <p className="mt-1 text-sm text-stone-deep">Consultation découverte offerte · 30 min</p>
              </>
            ) : (
              <p className="mt-2 text-sm">Aucun créneau dans les 3 prochaines semaines.</p>
            )}
            <Link to={`${ROUTES.booking}?type=decouverte`} className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-medium underline-offset-4 hover:underline">
              Réserver ce créneau <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}

// ── 2. Produits sélectionnés ────────────────────────────────────────────────
function FeaturedGrid() {
  const featured = useProducts().filter((product) => product.featured).slice(0, 4)
  return (
    <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {featured.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  )
}

export function FeaturedProductsSection() {
  return (
    <section aria-labelledby="featured-title" className="py-16 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Sélection" title="Pièces choisies" id="featured-title">
            {BRAND.taglines[1]}
          </SectionHeading>
          <ButtonLink to={ROUTES.shop} variant="secondary">
            Toute la collection
          </ButtonLink>
        </div>
        <Suspense fallback={<p className="mt-10 text-sm text-stone-deep" role="status">Chargement de la sélection…</p>}>
          <FeaturedGrid />
        </Suspense>
      </Container>
    </section>
  )
}

// ── 3. Comment pouvons-nous vous aider ? ────────────────────────────────────
const HELP_ITEMS = [
  { icon: 'search', title: 'Trouver la bonne pièce', text: 'Filtrez la collection par catégorie, budget ou mot-clé.', to: ROUTES.shop, cta: 'Parcourir' },
  { icon: 'sparkle', title: 'Être guidé', text: 'Décrivez votre pièce à ARIA, notre assistante, pour des suggestions ciblées.', to: ROUTES.concierge, cta: 'Demander à ARIA' },
  { icon: 'calendar', title: 'Concevoir un projet', text: 'Rencontrez un conseiller en boutique ou en visio pour aller plus loin.', to: ROUTES.booking, cta: 'Prendre rendez-vous' },
]

export function HelpSection() {
  return (
    <section aria-labelledby="help-title" className="bg-white py-16 sm:py-24">
      <Container>
        <SectionHeading eyebrow="Services" title="Comment pouvons-nous vous aider ?" id="help-title" />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {HELP_ITEMS.map((item) => (
            <li key={item.title} className="flex flex-col rounded-3xl bg-ivory p-7 transition hover:-translate-y-1 hover:shadow-float">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sand">
                <Icon name={item.icon} />
              </span>
              <h3 className="mt-6 font-serif text-2xl">{item.title}</h3>
              <p className="mt-2 flex-1 leading-relaxed text-stone-deep">{item.text}</p>
              <Link to={item.to} className="mt-6 inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline">
                {item.cta} <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

// ── 4. Aperçu des consultations ─────────────────────────────────────────────
export function ConsultationPreviewSection() {
  return (
    <section aria-labelledby="consultation-title" className="py-16 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem]">
          <SmartImage image={sceneImages.living} sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
        <div>
          <SectionHeading eyebrow="Consultations" title="Un regard d’expert sur votre intérieur" id="consultation-title">
            {BRAND.taglines[2]}
          </SectionHeading>
          <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
            {CONSULTATION_TYPES.map((type) => (
              <li key={type.id} className="flex items-baseline justify-between gap-4 py-4">
                <span>
                  <span className="block font-serif text-xl">{type.name}</span>
                  <span className="text-sm text-stone-deep">{type.durationMin} min · en boutique ou en visio</span>
                </span>
                <span className="shrink-0 text-sm">{type.price === 0 ? 'Offerte' : formatPrice(type.price)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-stone-deep">Tarifs et consultants fictifs.</p>
          <ButtonLink to={ROUTES.booking} className="mt-8">
            Prendre rendez-vous
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}

// ── 5. Aperçu de l'assistant ────────────────────────────────────────────────
export function ConciergePreviewSection() {
  return (
    <section aria-labelledby="aria-preview-title" className="bg-espresso py-16 text-ivory sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="text-xs font-medium tracking-[0.25em] text-gold uppercase">Assistant</p>
          <h2 id="aria-preview-title" className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
            ARIA Concierge
          </h2>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-ivory/80">
            Décrivez votre pièce, votre style ou votre budget : ARIA vous propose des pièces de la collection et
            explique pourquoi. Assistant simulé — aucune IA n’est connectée dans cette démonstration.
          </p>
          <ButtonLink to={ROUTES.concierge} variant="light" size="lg" className="mt-8">
            <Icon name="sparkle" className="h-4 w-4" />
            Parler à l’assistant
          </ButtonLink>
        </div>

        <figure className="rounded-[2rem] bg-ivory p-5 text-ink shadow-float sm:p-6">
          <figcaption className="text-xs text-stone-deep">Exemple d’échange (illustration)</figcaption>
          <div className="mt-4 space-y-4 text-sm">
            <p className="ml-auto max-w-[85%] rounded-3xl rounded-br-md bg-ink px-4 py-3 text-ivory">
              Je cherche un canapé pour un petit salon.
            </p>
            <p className="max-w-[90%] rounded-3xl rounded-tl-md bg-white px-4 py-3">
              Voici 3 pièces de la collection qui correspondent à votre demande (canapé, format compact, salon).
            </p>
            <Link to={ROUTES.product('canape-sienne')} className="flex items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-white p-3 hover:border-ink">
              <span>
                <span className="block font-serif text-lg">Canapé Sienne compact</span>
                <span className="text-xs text-stone-deep">Canapé · format compact · salon</span>
              </span>
              <Icon name="arrowRight" className="h-4 w-4 shrink-0" />
            </Link>
          </div>
        </figure>
      </Container>
    </section>
  )
}

// ── 6. Réservation : prochains créneaux ─────────────────────────────────────
export function NextSlotsSection() {
  const slots = useNextSlots(3)

  return (
    <section aria-labelledby="slots-title" className="py-16 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Réservation" title="Prochains créneaux disponibles" id="slots-title">
            Consultation découverte offerte, 30 minutes. Calendrier de démonstration.
          </SectionHeading>
          <Badge tone="gold">Démonstration</Badge>
        </div>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {slots.map((slot) => (
            <li key={slot.start}>
              <Link
                to={`${ROUTES.booking}?type=decouverte`}
                className="flex h-full flex-col rounded-3xl border border-ink/10 bg-white p-6 transition hover:-translate-y-1 hover:shadow-float"
              >
                <span className="text-sm text-stone-deep first-letter:uppercase">{formatLongDate(slot.start)}</span>
                <span className="mt-1 font-serif text-4xl">{formatTime(slot.start)}</span>
                <span className="mt-4 text-sm">avec {findConsultant(slot.consultantId).name}</span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium">
                  Choisir ce créneau <Icon name="arrowRight" className="h-4 w-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

// ── 7. Appel à l'action final ───────────────────────────────────────────────
export function FinalCtaSection() {
  return (
    <section aria-labelledby="cta-title" className="pb-8">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[2.5rem]">
          <div className="absolute inset-0 -z-10">
            <SmartImage image={sceneImages.exterior} ratio={0.5} sizes="100vw" />
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/85 via-ink/60 to-ink/20" aria-hidden="true" />
          <div className="max-w-2xl px-6 py-16 text-ivory sm:px-12 sm:py-24">
            <h2 id="cta-title" className="font-serif text-4xl leading-tight sm:text-6xl">
              Imaginez votre espace.
              <br />
              Nous vous aidons à le réaliser.
            </h2>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to={ROUTES.booking} variant="light" size="lg">
                Prendre rendez-vous
              </ButtonLink>
              <ButtonLink to={ROUTES.shop} size="lg" variant="outlineLight">
                Découvrir la collection
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
