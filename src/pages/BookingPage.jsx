import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { DEMO_BOOKING_NOTICE } from '../app/brand'
import { PageHeader } from '../components/layout/PageHeader'
import { Container } from '../components/ui/Container'
import { Icon } from '../components/ui/Icon'
import { BookingWizard } from '../features/booking/BookingWizard'
import { useBookings } from '../features/booking/useBookings'
import { useNow } from '../lib/useNow'

export function BookingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const bookings = useBookings()
  const now = useNow()
  // Changer la `key` recrée le formulaire à neuf (bouton « Faire une nouvelle réservation »).
  const [attempt, setAttempt] = useState(0)

  // ?modify=<id> : modification d'un rendez-vous existant, à venir et créé dans ce navigateur.
  const modifyId = searchParams.get('modify')
  const reschedule = bookings.find(
    (booking) =>
      booking.id === modifyId && booking.source === 'user' && booking.status === 'confirmed' && Date.parse(booking.start) > now.getTime(),
  )

  function restart() {
    setSearchParams({}, { replace: true })
    setAttempt((count) => count + 1)
  }

  return (
    <>
      <PageHeader
        eyebrow="Consultations"
        title={reschedule ? 'Modifier mon rendez-vous' : 'Prendre rendez-vous'}
        description="Un échange avec nos conseillers pour imaginer, aménager et meubler votre intérieur."
      >
        <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold/25 px-4 py-2 text-sm">
          <Icon name="calendar" className="h-4 w-4" />
          {DEMO_BOOKING_NOTICE}
        </p>
        {modifyId && !reschedule && (
          <p role="alert" className="mt-4 text-sm text-terracotta-deep">
            Ce rendez-vous ne peut pas être modifié (introuvable, passé ou annulé). Vous pouvez en réserver un nouveau.
          </p>
        )}
      </PageHeader>

      <Container>
        <BookingWizard
          key={attempt}
          reschedule={reschedule}
          preselectedTypeId={searchParams.get('type')}
          onConfirmed={() => setSearchParams({}, { replace: true })}
          onRestart={restart}
        />
      </Container>
    </>
  )
}
