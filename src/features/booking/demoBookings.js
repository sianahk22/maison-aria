// Génère des réservations FICTIVES d'autres clients, pour que le calendrier de démonstration
// contienne des créneaux déjà pris. Génération déterministe (même résultat pour un même jour)
// et relative à la date du jour, afin que la démo reste crédible quel que soit le moment.
import { CONSULTANTS } from '../../data/consultations'
import { findConsultationType, getDaySlots } from './availability'
import { addDays, toDateKey } from './time'

const DEMO_CLIENTS = ['Client fictif A.', 'Client fictif B.', 'Client fictif C.', 'Client fictif D.', 'Client fictif E.']

// Petit hachage de texte → nombre entre 0 et 1 (pseudo-aléatoire mais reproductible).
function pseudoRandom(seed) {
  let hash = 2166136261
  for (const char of seed) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619)
  return ((hash >>> 0) % 1000) / 1000
}

export function generateDemoBookings(now = new Date(), { pastDays = 14, futureDays = 21 } = {}) {
  const bookings = []
  const today = toDateKey(now)
  // Une date de référence très ancienne : les créneaux passés sont aussi générés (historique).
  const longAgo = new Date(0)

  for (let offset = -pastDays; offset < futureDays; offset++) {
    const dateKey = addDays(today, offset)
    for (const consultant of CONSULTANTS) {
      const typeIds = consultant.consultationTypeIds
      for (const slot of getDaySlots({ dateKey, durationMin: 30, consultantId: consultant.id, bookings, now: longAgo })) {
        if (slot.status !== 'available') continue
        const seed = `${dateKey}|${consultant.id}|${slot.start}`
        if (pseudoRandom(seed) > 0.16) continue

        const type = findConsultationType(typeIds[Math.floor(pseudoRandom(`${seed}|type`) * typeIds.length)])
        const start = Date.parse(slot.start)
        const end = start + type.durationMin * 60000
        const fits = getDaySlots({ dateKey, durationMin: type.durationMin, consultantId: consultant.id, bookings, now: longAgo })
          .some((candidate) => candidate.start === slot.start && candidate.status === 'available')
        if (!fits) continue

        const index = bookings.length
        bookings.push({
          id: `demo-${index + 1}`,
          requestId: `demo-${index + 1}`,
          source: 'demo',
          consultationTypeId: type.id,
          consultantId: consultant.id,
          format: consultant.formatIds[index % consultant.formatIds.length],
          start: slot.start,
          end: new Date(end).toISOString(),
          status: pseudoRandom(`${seed}|cancel`) < 0.08 ? 'cancelled' : 'confirmed',
          customer: {
            name: DEMO_CLIENTS[index % DEMO_CLIENTS.length],
            email: `client-${index + 1}@exemple.fr`,
            message: '',
          },
          createdAt: new Date(start - (2 + (index % 9)) * 86400000).toISOString(),
        })
      }
    }
  }
  return bookings
}
