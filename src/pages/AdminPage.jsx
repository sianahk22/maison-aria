import { useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { Badge, DemoDataBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Icon } from '../components/ui/Icon'
import { Modal } from '../components/ui/Modal'
import { DEMO_AVERAGE_CART, DEMO_CONCIERGE_REQUESTS, DEMO_PRODUCT_VIEWS } from '../data/demoAnalytics'
import { BarList, Panel, StatCard } from '../features/admin/DashboardWidgets'
import { STATUS_LABELS, bookingStatus, computeDashboard, topViewedProducts } from '../features/admin/dashboardStats'
import { resetDemoData } from '../features/admin/resetDemoData'
import { findConsultant, findConsultationType } from '../features/booking/availability'
import { formatDayParts, formatLongDate, formatTime } from '../features/booking/time'
import { useBookings } from '../features/booking/useBookings'
import { conciergeLogStore } from '../features/concierge/conciergeLogStore'
import { productViewsStore } from '../features/products/productViewsStore'
import { useProducts } from '../features/products/useProducts'
import { formatPrice } from '../lib/format'
import { showToast } from '../lib/toast'
import { useNow } from '../lib/useNow'
import { useStore } from '../lib/useStore'

const INTENT_LABELS = {
  recommendation: 'Recommandation',
  advisor: 'Conseiller',
  no_match: 'Sans résultat',
  greeting: 'Salutation',
  unknown: 'Incomprise',
}
const STATUS_TONES = { upcoming: 'sage', completed: 'neutral', cancelled: 'outline' }

export function AdminPage() {
  const products = useProducts()
  const bookings = useBookings()
  const localViews = useStore(productViewsStore)
  const { requests: localRequests } = useStore(conciergeLogStore)
  const now = useNow()
  const [resetOpen, setResetOpen] = useState(false)

  const stats = computeDashboard(bookings, now)
  const productName = (id) => products.find((product) => product.id === id)?.name ?? id
  const topProducts = topViewedProducts(DEMO_PRODUCT_VIEWS, localViews).map((item) => ({
    label: productName(item.productId),
    value: item.views,
  }))
  const demoRequests = DEMO_CONCIERGE_REQUESTS.map((request) => ({
    ...request,
    at: new Date(now.getTime() - request.hoursAgo * 3600000).toISOString(),
  }))
  const requests = [...localRequests, ...demoRequests]
  const weekMax = Math.max(1, ...stats.week.map((day) => day.count))

  return (
    <>
      <PageHeader eyebrow="Administration" title="Tableau de bord" description="Vue d’ensemble de l’activité du showroom Maison Aria.">
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <DemoDataBadge />
          <p className="text-sm text-stone-deep">
            Chiffres fictifs générés localement — ils ne reflètent l’activité d’aucune entreprise réelle.
          </p>
        </div>
      </PageHeader>

      <Container className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Réservations du jour" value={stats.todayBookings.length} hint="Données de démonstration" />
          <StatCard label="Consultations sur 7 jours" value={stats.upcomingCount7Days} hint="Données de démonstration" />
          <StatCard label="Demandes à ARIA" value={requests.length} hint={`dont ${localRequests.length} dans ce navigateur`} />
          <StatCard label="Panier moyen fictif" value={formatPrice(DEMO_AVERAGE_CART)} hint="Valeur inventée" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Panel id="next-title" title="Prochaines consultations" className="lg:col-span-2">
            {stats.nextBookings.length === 0 ? (
              <p className="text-sm text-stone-deep">Aucune consultation à venir.</p>
            ) : (
              <ul className="divide-y divide-ink/10">
                {stats.nextBookings.map((booking) => (
                  <li key={booking.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
                    <div className="min-w-0">
                      <p className="font-medium first-letter:uppercase">
                        {formatLongDate(booking.start)} · {formatTime(booking.start)}
                      </p>
                      <p className="text-sm text-stone-deep">
                        {findConsultationType(booking.consultationTypeId).name} · {findConsultant(booking.consultantId).name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{booking.customer.name}</span>
                      <Badge tone={booking.format === 'visio' ? 'gold' : 'neutral'}>
                        {booking.format === 'visio' ? 'Visio' : 'Boutique'}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel id="status-title" title="Statut des consultations">
            <BarList
              colorClass="bg-sage-deep"
              items={Object.entries(stats.statusCounts).map(([status, count]) => ({ label: STATUS_LABELS[status], value: count }))}
            />
            <p className="mt-4 text-xs text-stone-deep">Période de démonstration : 2 semaines passées et 3 à venir.</p>
          </Panel>

          <Panel id="week-title" title="Calendrier des 7 prochains jours" className="lg:col-span-2">
            <ol className="grid grid-cols-7 items-end gap-2">
              {stats.week.map((day) => {
                const { weekday, day: dayNumber } = formatDayParts(day.dateKey)
                return (
                  <li key={day.dateKey} className="flex flex-col items-center gap-2">
                    <span className="text-sm font-medium">{day.count}</span>
                    <span className="flex h-28 w-full items-end rounded-xl bg-sand" aria-hidden="true">
                      <span className="w-full rounded-xl bg-terracotta" style={{ height: `${Math.max(6, (day.count / weekMax) * 100)}%` }} />
                    </span>
                    <span className="text-center text-xs leading-tight text-stone-deep capitalize">
                      {weekday.replace('.', '')}
                      <br />
                      {dayNumber}
                    </span>
                    <span className="sr-only">consultations</span>
                  </li>
                )
              })}
            </ol>
          </Panel>

          <Panel id="views-title" title="Produits les plus consultés">
            <BarList items={topProducts} />
          </Panel>

          <Panel id="aria-title" title="Demandes adressées à ARIA">
            <ul className="space-y-3">
              {requests.slice(0, 6).map((request) => (
                <li key={request.id} className="text-sm">
                  <p className="line-clamp-2">« {request.text} »</p>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-stone-deep">
                    <Badge tone="outline">{INTENT_LABELS[request.intent]}</Badge>
                    {request.resultCount} produit{request.resultCount > 1 ? 's' : ''} proposé{request.resultCount > 1 ? 's' : ''}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel id="latest-title" title="Dernières réservations" className="lg:col-span-2">
            {/* Le tableau peut défiler horizontalement sur mobile, sans élargir la page. */}
            <div className="-mx-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <caption className="sr-only">Les 8 réservations les plus récentes</caption>
                <thead className="text-xs text-stone-deep">
                  <tr className="border-b border-ink/10">
                    <th scope="col" className="py-2 pr-3 font-medium">Référence</th>
                    <th scope="col" className="py-2 pr-3 font-medium">Client</th>
                    <th scope="col" className="py-2 pr-3 font-medium">Consultation</th>
                    <th scope="col" className="py-2 pr-3 font-medium">Rendez-vous</th>
                    <th scope="col" className="py-2 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {stats.latest.map((booking) => {
                    const status = bookingStatus(booking, now)
                    return (
                      <tr key={booking.id}>
                        <td className="py-3 pr-3 font-mono text-xs">{booking.id}</td>
                        <td className="py-3 pr-3">{booking.customer.name}</td>
                        <td className="py-3 pr-3">{findConsultationType(booking.consultationTypeId).name}</td>
                        <td className="py-3 pr-3 whitespace-nowrap">
                          {new Date(booking.start).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', timeZone: 'Europe/Paris' })}{' '}
                          {formatTime(booking.start)}
                        </td>
                        <td className="py-3">
                          <Badge tone={STATUS_TONES[status]}>{STATUS_LABELS[status]}</Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel id="reset-title" title="Outils de démonstration">
            <p className="text-sm leading-relaxed text-stone-deep">
              Remet à zéro, dans ce navigateur uniquement, le panier, les réservations, le journal d’ARIA et les
              fiches consultées.
            </p>
            <Button variant="secondary" size="sm" className="mt-4" onClick={() => setResetOpen(true)}>
              <Icon name="trash" className="h-4 w-4" />
              Réinitialiser la démo
            </Button>
          </Panel>
        </div>
      </Container>

      <Modal open={resetOpen} onClose={() => setResetOpen(false)} title="Réinitialiser la démonstration ?">
        <p className="text-sm leading-relaxed text-stone-deep">
          Vos réservations de démonstration, votre panier et l’historique d’ARIA seront effacés de ce navigateur.
          Les données fictives seront régénérées. Cette action ne touche aucune donnée réelle.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            variant="accent"
            className="sm:flex-1"
            onClick={() => {
              resetDemoData()
              setResetOpen(false)
              showToast({ message: 'Démonstration réinitialisée.' })
            }}
          >
            Réinitialiser
          </Button>
          <Button variant="secondary" className="sm:flex-1" onClick={() => setResetOpen(false)}>
            Annuler
          </Button>
        </div>
      </Modal>
    </>
  )
}
