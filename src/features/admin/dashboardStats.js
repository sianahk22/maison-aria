// Calculs du tableau de bord : fonctions pures, à partir des réservations et de l'heure actuelle.
import { addDays, toDateKey } from '../booking/time'

const startOf = (booking) => Date.parse(booking.start)

export function bookingStatus(booking, now) {
  if (booking.status === 'cancelled') return 'cancelled'
  return startOf(booking) < now.getTime() ? 'completed' : 'upcoming'
}

export const STATUS_LABELS = { upcoming: 'À venir', completed: 'Terminée', cancelled: 'Annulée' }

export function computeDashboard(bookings, now) {
  const today = toDateKey(now)
  const in7Days = now.getTime() + 7 * 86400000
  const confirmed = bookings.filter((booking) => booking.status === 'confirmed')

  const todayBookings = confirmed
    .filter((booking) => toDateKey(new Date(booking.start)) === today)
    .sort((a, b) => startOf(a) - startOf(b))

  const upcoming = confirmed
    .filter((booking) => startOf(booking) >= now.getTime())
    .sort((a, b) => startOf(a) - startOf(b))

  const statusCounts = { upcoming: 0, completed: 0, cancelled: 0 }
  for (const booking of bookings) statusCounts[bookingStatus(booking, now)] += 1

  const week = Array.from({ length: 7 }, (_, index) => {
    const dateKey = addDays(today, index)
    return { dateKey, count: confirmed.filter((booking) => toDateKey(new Date(booking.start)) === dateKey).length }
  })

  const latest = [...bookings].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 8)

  return {
    todayBookings,
    upcomingCount7Days: upcoming.filter((booking) => startOf(booking) <= in7Days).length,
    nextBookings: upcoming.slice(0, 6),
    statusCounts,
    week,
    latest,
  }
}

// Fusionne les vues fictives et celles de ce navigateur, puis garde les plus consultés.
export function topViewedProducts(demoViews, localViews, limit = 5) {
  const totals = { ...demoViews }
  for (const [productId, count] of Object.entries(localViews)) totals[productId] = (totals[productId] ?? 0) + count
  return Object.entries(totals)
    .map(([productId, views]) => ({ productId, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit)
}
