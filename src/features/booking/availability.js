// Logique pure des réservations : calcul des créneaux, détection des conflits, validation.
// Aucune dépendance à React ni au stockage. Les créneaux ne sont jamais stockés :
// ils sont recalculés à partir des horaires et des réservations existantes.
import { BOOKING_RULES, CONSULTANTS, CONSULTATION_TYPES, SCHEDULE } from '../../data/consultations'
import { addDays, parisTimeToDate, toDateKey, weekdayOf } from './time'

const MINUTE = 60000

// Deux intervalles [début, fin[ se chevauchent si chacun commence avant la fin de l'autre.
// Couvre tous les cas : chevauchement partiel, inclusion, horaires identiques.
export function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd
}

const isActive = (booking) => booking.status === 'confirmed'
const toRange = (booking) => [Date.parse(booking.start), Date.parse(booking.end)]

export const findConsultationType = (id) => CONSULTATION_TYPES.find((type) => type.id === id)
export const findConsultant = (id) => CONSULTANTS.find((consultant) => consultant.id === id)

export function consultantsFor(consultationTypeId) {
  return CONSULTANTS.filter((consultant) => consultant.consultationTypeIds.includes(consultationTypeId))
}

// Tous les créneaux d'une journée pour un consultant, avec leur statut :
// 'available' (libre), 'booked' (déjà réservé) ou 'past' (passé ou trop proche).
export function getDaySlots({ dateKey, durationMin, consultantId, bookings, now, ignoreBookingId, rules = BOOKING_RULES }) {
  const periods = SCHEDULE[consultantId]?.[weekdayOf(dateKey)] ?? []
  const duration = durationMin * MINUTE
  const earliestStart = now.getTime() + rules.minNoticeMin * MINUTE
  const busy = bookings
    .filter((booking) => isActive(booking) && booking.consultantId === consultantId && booking.id !== ignoreBookingId)
    .map(toRange)

  const slots = []
  for (const [open, close] of periods) {
    const closeTime = parisTimeToDate(dateKey, close).getTime()
    for (let start = parisTimeToDate(dateKey, open).getTime(); start + duration <= closeTime; start += rules.slotStepMin * MINUTE) {
      const end = start + duration
      let status = 'available'
      if (start < earliestStart) status = 'past'
      else if (busy.some(([busyStart, busyEnd]) => rangesOverlap(start, end, busyStart, busyEnd))) status = 'booked'
      slots.push({ start: new Date(start).toISOString(), end: new Date(end).toISOString(), status })
    }
  }
  return slots
}

// Les prochains jours réservables, avec le nombre de créneaux libres de chacun.
export function getBookableDays({ durationMin, consultantId, bookings, now, ignoreBookingId, rules = BOOKING_RULES }) {
  const today = toDateKey(now)
  return Array.from({ length: rules.horizonDays }, (_, index) => {
    const dateKey = addDays(today, index)
    const slots = getDaySlots({ dateKey, durationMin, consultantId, bookings, now, ignoreBookingId, rules })
    return {
      dateKey,
      isOpen: slots.length > 0,
      availableCount: slots.filter((slot) => slot.status === 'available').length,
    }
  })
}

// Vérification complète d'une demande, utilisée au moment de CONFIRMER (deuxième vérification).
// Retourne null si tout est bon, sinon un code d'erreur.
export function checkBookingRequest(request, bookings, now) {
  const type = findConsultationType(request.consultationTypeId)
  const consultant = findConsultant(request.consultantId)
  if (!type || !consultant) return 'INVALID_REQUEST'
  if (!consultant.consultationTypeIds.includes(type.id)) return 'INVALID_REQUEST'
  if (!consultant.formatIds.includes(request.format)) return 'INVALID_REQUEST'

  const slots = getDaySlots({
    dateKey: toDateKey(new Date(request.start)),
    durationMin: type.durationMin,
    consultantId: consultant.id,
    bookings,
    now,
    ignoreBookingId: request.replacesBookingId,
  })
  const slot = slots.find((candidate) => candidate.start === request.start)
  if (!slot) return 'INVALID_REQUEST' // hors des horaires d'ouverture
  if (slot.status === 'past') return 'SLOT_IN_PAST'
  if (slot.status === 'booked') return 'SLOT_TAKEN'

  // Une même personne ne peut pas avoir deux rendez-vous qui se chevauchent (tous consultants confondus).
  const email = request.customer.email.trim().toLowerCase()
  const clientOverlap = bookings.some(
    (booking) =>
      isActive(booking) &&
      booking.id !== request.replacesBookingId &&
      booking.customer.email.toLowerCase() === email &&
      rangesOverlap(Date.parse(slot.start), Date.parse(slot.end), ...toRange(booking)),
  )
  return clientOverlap ? 'CLIENT_OVERLAP' : null
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateContact({ name, email, message }) {
  const errors = {}
  if (name.trim().length < 2) errors.name = 'Indiquez votre nom (2 caractères minimum).'
  if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Indiquez une adresse email valide, par exemple nom@exemple.fr.'
  if (message.length > 500) errors.message = 'Votre message ne doit pas dépasser 500 caractères.'
  return errors
}

// Les prochains créneaux libres, tous consultants confondus (aperçus de la page d'accueil).
export function findNextAvailableSlots({ consultationTypeId, bookings, now, limit = 3, rules = BOOKING_RULES }) {
  const type = findConsultationType(consultationTypeId)
  const found = []
  const today = toDateKey(now)
  for (let offset = 0; offset < rules.horizonDays && found.length < limit; offset++) {
    const dateKey = addDays(today, offset)
    const daySlots = consultantsFor(type.id).flatMap((consultant) =>
      getDaySlots({ dateKey, durationMin: type.durationMin, consultantId: consultant.id, bookings, now, rules })
        .filter((slot) => slot.status === 'available')
        .map((slot) => ({ ...slot, consultantId: consultant.id })),
    )
    // Un seul créneau par horaire (le premier consultant libre), triés chronologiquement.
    const byStart = new Map()
    for (const slot of daySlots.sort((a, b) => a.start.localeCompare(b.start))) if (!byStart.has(slot.start)) byStart.set(slot.start, slot)
    found.push(...[...byStart.values()].slice(0, limit - found.length))
  }
  return found
}
