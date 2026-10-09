import { bookingStore } from '../booking/bookingStore'
import { cartStore } from '../cart/cartStore'
import { conciergeLogStore } from '../concierge/conciergeLogStore'
import { productViewsStore } from '../products/productViewsStore'

// Remet la démonstration à zéro dans ce navigateur (panier, réservations, journal ARIA, vues).
export function resetDemoData() {
  for (const store of [bookingStore, cartStore, conciergeLogStore, productViewsStore]) store.reset()
}
