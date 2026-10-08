import { PageHeader } from '../components/layout/PageHeader'
import { ComingSoon } from '../components/ui/ComingSoon'

export function BookingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Consultations"
        title="Réserver une consultation"
        description="Choisissez un soin, une praticienne et un créneau disponible."
      />
      <ComingSoon step={6}>
        Calendrier des disponibilités, choix du créneau et confirmation, avec prévention des doubles réservations.
      </ComingSoon>
    </>
  )
}
