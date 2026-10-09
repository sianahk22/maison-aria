// Service de réservation de DÉMONSTRATION : aucun rendez-vous réel n'est créé.
// Il joue le rôle d'un serveur : c'est lui qui a le dernier mot sur la disponibilité.
//
// Pour passer en production : remplacer le corps des fonctions par des appels HTTP
// (ex. POST /api/bookings). La garantie anti-doublon viendrait alors de la base de données
// (contrainte d'unicité / d'exclusion sur consultant + plage horaire, dans une transaction).
import { checkBookingRequest } from '../features/booking/availability'
import { bookingStore } from '../features/booking/bookingStore'
import { wait } from '../lib/wait'

const BOOKING_ERRORS = {
  SLOT_TAKEN: 'Ce créneau vient d’être réservé par une autre personne. Merci d’en choisir un autre.',
  SLOT_IN_PAST: 'Ce créneau n’est plus réservable (il est passé ou trop proche). Merci d’en choisir un autre.',
  CLIENT_OVERLAP: 'Vous avez déjà un rendez-vous qui chevauche cet horaire.',
  INVALID_REQUEST: 'La demande de réservation est incomplète ou invalide. Merci de vérifier vos choix.',
  NOT_FOUND: 'Cette réservation est introuvable.',
}

export class BookingError extends Error {
  constructor(code) {
    super(BOOKING_ERRORS[code] ?? BOOKING_ERRORS.INVALID_REQUEST)
    this.code = code
  }
}

const newId = () => `rdv-${crypto.randomUUID().slice(0, 8)}`

export async function createBooking(request) {
  await wait(800) // latence réseau simulée : c'est pendant ce délai qu'un double-clic serait dangereux

  // ⚠️ À partir d'ici, aucun `await` : lecture, vérification et écriture s'enchaînent sans
  // interruption possible dans cet onglet (JavaScript n'exécute qu'une chose à la fois).
  const { bookings } = bookingStore.getState()

  // Idempotence : la même demande envoyée deux fois (double-clic, réseau qui « rejoue »)
  // renvoie la réservation déjà créée au lieu d'en créer une seconde.
  const alreadyCreated = bookings.find((booking) => booking.requestId === request.requestId)
  if (alreadyCreated) return alreadyCreated

  // Deuxième vérification, obligatoire : le créneau a pu être pris depuis son affichage.
  const errorCode = checkBookingRequest(request, bookings, new Date())
  if (errorCode) throw new BookingError(errorCode)

  const createdAt = new Date().toISOString()
  const booking = {
    id: newId(),
    requestId: request.requestId,
    source: 'user',
    consultationTypeId: request.consultationTypeId,
    consultantId: request.consultantId,
    format: request.format,
    start: request.start,
    end: request.end,
    status: 'confirmed',
    customer: {
      name: request.customer.name.trim(),
      email: request.customer.email.trim(),
      message: request.customer.message.trim(),
    },
    createdAt,
    replacesBookingId: request.replacesBookingId,
  }

  bookingStore.setState((state) => ({
    bookings: [
      // Une modification annule l'ancien rendez-vous dans la même opération.
      ...state.bookings.map((item) =>
        item.id === request.replacesBookingId ? { ...item, status: 'cancelled', cancelledAt: createdAt } : item,
      ),
      booking,
    ],
  }))
  return booking
}

export async function cancelBooking(bookingId) {
  await wait(400)
  const exists = bookingStore.getState().bookings.some((booking) => booking.id === bookingId)
  if (!exists) throw new BookingError('NOT_FOUND')
  bookingStore.setState((state) => ({
    bookings: state.bookings.map((booking) =>
      booking.id === bookingId ? { ...booking, status: 'cancelled', cancelledAt: new Date().toISOString() } : booking,
    ),
  }))
}

// Outil de DÉMONSTRATION : simule une autre personne qui réserve le même créneau
// pendant que l'on relit son récapitulatif, pour montrer la deuxième vérification.
export function simulateCompetingBooking(request) {
  bookingStore.setState((state) => ({
    bookings: [
      ...state.bookings,
      {
        id: newId(),
        requestId: `concurrent-${crypto.randomUUID()}`,
        source: 'demo',
        consultationTypeId: request.consultationTypeId,
        consultantId: request.consultantId,
        format: request.format,
        start: request.start,
        end: request.end,
        status: 'confirmed',
        customer: { name: 'Client fictif concurrent', email: 'concurrent@exemple.fr', message: '' },
        createdAt: new Date().toISOString(),
      },
    ],
  }))
}
