import { useState } from 'react'
import { ROUTES } from '../../app/routes'
import { Badge } from '../../components/ui/Badge'
import { Button, ButtonLink } from '../../components/ui/Button'
import { showToast } from '../../lib/toast'
import { cancelBooking } from '../../services/bookingService'
import { STATUS_LABELS } from '../admin/dashboardStats'
import { BookingSummary } from '../booking/BookingSummary'

const STATUS_TONES = { upcoming: 'sage', completed: 'neutral', cancelled: 'outline' }

export function AccountBookingCard({ booking, status }) {
  // L'annulation se fait en deux temps (« Annuler » puis « Confirmer l'annulation ») pour éviter les erreurs.
  const [confirming, setConfirming] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState(null)

  async function confirmCancel() {
    setCancelling(true)
    setError(null)
    try {
      await cancelBooking(booking.id)
      showToast({ message: 'Rendez-vous annulé : le créneau est de nouveau disponible.' })
    } catch (cancelError) {
      setError(cancelError.message)
      setCancelling(false)
    }
  }

  return (
    <article className="rounded-3xl bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge tone={STATUS_TONES[status]}>{STATUS_LABELS[status]}</Badge>
        <p className="text-xs text-stone-deep">Réf. {booking.id}</p>
      </div>
      <div className="mt-3">
        <BookingSummary booking={booking} showContact={false} />
      </div>

      {status === 'upcoming' && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {confirming ? (
            <>
              <p className="w-full text-sm">Annuler ce rendez-vous de démonstration ?</p>
              <Button variant="accent" size="sm" onClick={confirmCancel} disabled={cancelling} aria-busy={cancelling}>
                {cancelling ? 'Annulation…' : 'Confirmer l’annulation'}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setConfirming(false)} disabled={cancelling}>
                Garder le rendez-vous
              </Button>
            </>
          ) : (
            <>
              <ButtonLink to={`${ROUTES.booking}?modify=${booking.id}`} variant="secondary" size="sm">
                Modifier
              </ButtonLink>
              <Button variant="ghost" size="sm" onClick={() => setConfirming(true)}>
                Annuler
              </Button>
            </>
          )}
          {error && (
            <p role="alert" className="w-full text-sm text-terracotta-deep">
              {error}
            </p>
          )}
        </div>
      )}
    </article>
  )
}
