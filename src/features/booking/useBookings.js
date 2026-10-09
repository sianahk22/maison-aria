import { useStore } from '../../lib/useStore'
import { bookingStore } from './bookingStore'

// Liste des réservations, mise à jour en direct (y compris depuis un autre onglet).
export function useBookings() {
  return useStore(bookingStore).bookings
}
