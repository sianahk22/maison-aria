import { ROUTES } from '../app/routes'
import { PageHeader } from '../components/layout/PageHeader'
import { DemoDataBadge } from '../components/ui/Badge'
import { ButtonLink } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Icon } from '../components/ui/Icon'
import { DEMO_ORDERS, DEMO_PROFILE } from '../data/demoAccount'
import { STYLES } from '../data/products'
import { AccountBookingCard } from '../features/account/AccountBookingCard'
import { bookingStatus } from '../features/admin/dashboardStats'
import { formatLongDate } from '../features/booking/time'
import { useBookings } from '../features/booking/useBookings'
import { ProductCard } from '../features/products/ProductCard'
import { useProducts } from '../features/products/useProducts'
import { formatPrice } from '../lib/format'
import { recommend } from '../lib/recommendationEngine'
import { useNow } from '../lib/useNow'

function Section({ id, title, action, children }) {
  return (
    <section aria-labelledby={id} className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id={id} className="font-serif text-3xl">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
}

export function AccountPage() {
  const products = useProducts()
  const bookings = useBookings()
  const now = useNow()
  const productsById = new Map(products.map((product) => [product.id, product]))

  // Sans authentification réelle, « mes » rendez-vous = ceux créés dans ce navigateur.
  const mine = bookings
    .filter((booking) => booking.source === 'user')
    .map((booking) => ({ booking, status: bookingStatus(booking, now) }))
  const upcoming = mine.filter((item) => item.status === 'upcoming').sort((a, b) => Date.parse(a.booking.start) - Date.parse(b.booking.start))
  const history = mine.filter((item) => item.status !== 'upcoming').sort((a, b) => Date.parse(b.booking.start) - Date.parse(a.booking.start))

  const recommendations = recommend(DEMO_PROFILE.recommendationQuery, products).recommendations
    .map((item) => productsById.get(item.productId))
    .filter(Boolean)

  return (
    <>
      <PageHeader eyebrow="Espace client" title="Bonjour, Client démo" description="Vos rendez-vous, votre historique et une sélection pensée pour vous.">
        <p className="mt-6 flex max-w-3xl gap-3 rounded-2xl bg-gold/25 p-4 text-sm leading-relaxed">
          <Icon name="alert" className="mt-0.5 h-5 w-5 shrink-0" />
          <span>
            <strong>Espace de démonstration.</strong> Aucune authentification réelle n’est connectée :
            le profil est fictif et les rendez-vous affichés sont ceux réservés dans ce navigateur.
          </span>
        </p>
      </PageHeader>

      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-16">
        <aside aria-labelledby="profile-title" className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl bg-white p-6">
            <div className="flex items-center gap-4">
              <span aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-full bg-sand font-serif text-xl">
                CD
              </span>
              <div>
                <h2 id="profile-title" className="font-serif text-2xl">
                  {DEMO_PROFILE.name}
                </h2>
                <p className="text-sm text-stone-deep">Profil fictif</p>
              </div>
            </div>
            <dl className="mt-6 space-y-3 text-sm">
              {[
                ['Email', DEMO_PROFILE.email],
                ['Ville', DEMO_PROFILE.city],
                ['Client depuis', DEMO_PROFILE.memberSince],
                ['Styles préférés', DEMO_PROFILE.preferences.styles.map((style) => STYLES[style]).join(', ')],
                ['Budget indicatif', DEMO_PROFILE.preferences.budget],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-stone-deep">{label}</dt>
                  <dd className="font-medium break-words">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>

        <div className="space-y-16">
          <Section
            id="upcoming-title"
            title="Mes rendez-vous à venir"
            action={
              <ButtonLink to={ROUTES.booking} size="sm">
                Prendre rendez-vous
              </ButtonLink>
            }
          >
            {upcoming.length > 0 ? (
              <ul className="space-y-4">
                {upcoming.map(({ booking, status }) => (
                  <li key={booking.id}>
                    <AccountBookingCard booking={booking} status={status} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-3xl border border-dashed border-ink/20 p-8 text-center">
                <p className="text-stone-deep">Aucun rendez-vous à venir pour le moment.</p>
                <ButtonLink to={ROUTES.booking} variant="secondary" className="mt-4">
                  Réserver une consultation
                </ButtonLink>
              </div>
            )}
          </Section>

          <Section id="history-title" title="Historique" action={<DemoDataBadge />}>
            {history.length > 0 && (
              <ul className="space-y-4">
                {history.map(({ booking, status }) => (
                  <li key={booking.id}>
                    <AccountBookingCard booking={booking} status={status} />
                  </li>
                ))}
              </ul>
            )}
            <h3 className="font-serif text-xl">Commandes fictives</h3>
            <ul className="space-y-3">
              {DEMO_ORDERS.map((order) => {
                const lines = order.lines.filter((line) => productsById.has(line.productId))
                const total = lines.reduce((sum, line) => sum + productsById.get(line.productId).price * line.quantity, 0)
                return (
                  <li key={order.id} className="rounded-3xl bg-white p-5 sm:p-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-stone-deep">
                        {formatLongDate(`${order.date}T12:00:00Z`)} · {order.status}
                      </p>
                    </div>
                    <ul className="mt-3 space-y-1 text-sm text-stone-deep">
                      {lines.map((line) => (
                        <li key={line.productId}>
                          {line.quantity} × {productsById.get(line.productId).name}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-sm font-medium">Total fictif : {formatPrice(total)}</p>
                  </li>
                )
              })}
            </ul>
          </Section>

          <Section id="reco-title" title="Sélectionnés pour vous">
            <p className="-mt-2 text-sm text-stone-deep">
              Calculé par le moteur d’ARIA à partir des préférences fictives du profil (styles scandinave et naturel, salon).
            </p>
            <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-3">
              {recommendations.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </Container>
    </>
  )
}
