import { FORMATS } from '../../data/consultations'
import { formatPrice } from '../../lib/format'
import { findConsultant, findConsultationType } from './availability'
import { formatSlot } from './time'

const priceLabel = (price) => (price === 0 ? 'Offerte' : `${formatPrice(price)} (tarif fictif)`)

// Récapitulatif réutilisé avant confirmation, après confirmation et dans l'espace client.
export function BookingSummary({ booking, showContact = true }) {
  const type = findConsultationType(booking.consultationTypeId)
  const consultant = findConsultant(booking.consultantId)
  const format = FORMATS.find((item) => item.id === booking.format)

  const rows = [
    ['Consultation', `${type.name} · ${type.durationMin} min`],
    ['Date et heure', booking.start ? formatSlot(booking.start, booking.end) : '—'],
    ['Consultant·e', `${consultant.name}, ${consultant.title.toLowerCase()}`],
    ['Format', format.label],
    ['Tarif', priceLabel(type.price)],
  ]
  if (showContact) {
    rows.push(['Nom', booking.customer.name], ['Email', booking.customer.email])
    if (booking.customer.message) rows.push(['Message', booking.customer.message])
  }

  return (
    <dl className="divide-y divide-ink/10">
      {rows.map(([label, value]) => (
        <div key={label} className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr]">
          <dt className="text-sm text-stone-deep">{label}</dt>
          <dd className="text-sm font-medium break-words first-letter:uppercase">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
