import { createStore } from '../../lib/createStore'
import { generateDemoBookings } from './demoBookings'

// « Base de données » locale des réservations (localStorage). Seul bookingService y écrit.
// En production, elle serait remplacée par une vraie base côté serveur.
export const bookingStore = createStore({
  initialState: () => ({ bookings: generateDemoBookings() }),
  persist: {
    key: 'aura-studio:bookings',
    version: 1,
    validate: (state) =>
      Array.isArray(state?.bookings) &&
      state.bookings.every((booking) => booking.id && booking.start && booking.end && booking.customer?.email),
  },
})
