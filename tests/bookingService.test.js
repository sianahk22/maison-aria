import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getDaySlots } from '../src/features/booking/availability.js'
import { bookingStore } from '../src/features/booking/bookingStore.js'
import { addDays, toDateKey } from '../src/features/booking/time.js'
import { cancelBooking, createBooking, simulateCompetingBooking } from '../src/services/bookingService.js'

const overlaps = (a, b) => Date.parse(a.start) < Date.parse(b.end) && Date.parse(b.start) < Date.parse(a.end)

function firstFreeSlot(consultantId, durationMin, options = {}) {
  for (let offset = 3; offset < 20; offset++) {
    const dateKey = addDays(toDateKey(new Date()), offset)
    const slot = getDaySlots({ dateKey, durationMin, consultantId, bookings: bookingStore.getState().bookings, now: new Date(), ...options })
      .find((s) => s.status === 'available' && s.start !== options.exclude)
    if (slot) return slot
  }
  throw new Error('aucun créneau libre')
}

test('réservations fictives : jamais deux réservations confirmées qui se chevauchent', () => {
  const confirmed = bookingStore.getState().bookings.filter((b) => b.status === 'confirmed')
  assert.ok(confirmed.length > 20)
  for (const a of confirmed) for (const b of confirmed) if (a !== b && a.consultantId === b.consultantId) assert.ok(!overlaps(a, b), `${a.id}/${b.id}`)
})

test('parcours service : double-clic, conflit, concurrence, modification, annulation', async () => {
  const slot = firstFreeSlot('clara', 60)
  const req = { requestId: 'r1', consultationTypeId: 'projet-amenagement', consultantId: 'clara', format: 'visio', start: slot.start, end: slot.end, customer: { name: 'Alex Test', email: 'alex@exemple.fr', message: '' } }

  const [first, second] = await Promise.all([createBooking(req), createBooking(req)])
  assert.equal(first.id, second.id, 'idempotence : un double envoi ne crée qu’une réservation')
  assert.equal(bookingStore.getState().bookings.filter((b) => b.requestId === 'r1').length, 1)

  await assert.rejects(createBooking({ ...req, requestId: 'r2', customer: { ...req.customer, email: 'autre@exemple.fr' } }), { code: 'SLOT_TAKEN' })

  const hugoSlot = firstFreeSlot('hugo', 30)
  const competing = { ...req, requestId: 'r3', consultationTypeId: 'decouverte', consultantId: 'hugo', start: hugoSlot.start, end: hugoSlot.end, customer: { ...req.customer, email: 'c@exemple.fr' } }
  simulateCompetingBooking(competing)
  await assert.rejects(createBooking(competing), { code: 'SLOT_TAKEN' })

  const later = firstFreeSlot('clara', 60, { ignoreBookingId: first.id, exclude: slot.start })
  const moved = await createBooking({ ...req, requestId: 'r4', start: later.start, end: later.end, replacesBookingId: first.id })
  assert.equal(bookingStore.getState().bookings.find((b) => b.id === first.id).status, 'cancelled')
  assert.equal(moved.status, 'confirmed')

  await cancelBooking(moved.id)
  assert.equal(bookingStore.getState().bookings.find((b) => b.id === moved.id).status, 'cancelled')
  await assert.rejects(cancelBooking('inexistant'), { code: 'NOT_FOUND' })
})
