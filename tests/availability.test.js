import assert from 'node:assert/strict'
import { test } from 'node:test'
import { checkBookingRequest, findNextAvailableSlots, getBookableDays, getDaySlots, rangesOverlap, validateContact } from '../src/features/booking/availability.js'
import { addDays, formatTime, parisTimeToDate, toDateKey, weekdayOf } from '../src/features/booking/time.js'

const now = new Date('2026-10-20T08:00:00Z')
const booked = (overrides = {}) => ({
  id: 'x', status: 'confirmed', consultantId: 'clara',
  start: '2026-10-26T09:00:00.000Z', end: '2026-10-26T10:00:00.000Z',
  customer: { email: 'autre@exemple.fr' }, ...overrides,
})

test('fuseau Europe/Paris : heure d’été puis d’hiver (25/10/2026)', () => {
  assert.equal(parisTimeToDate('2026-10-24', '09:30').toISOString(), '2026-10-24T07:30:00.000Z')
  assert.equal(parisTimeToDate('2026-10-26', '09:30').toISOString(), '2026-10-26T08:30:00.000Z')
  assert.equal(parisTimeToDate('2026-03-30', '09:30').toISOString(), '2026-03-30T07:30:00.000Z')
  assert.equal(toDateKey(new Date('2026-10-08T22:30:00Z')), '2026-10-09')
  assert.equal(addDays('2026-10-31', 1), '2026-11-01')
  assert.equal(weekdayOf('2026-10-08'), 4)
  assert.equal(formatTime('2026-10-26T08:30:00.000Z'), '09:30')
})

test('chevauchement : partiel, inclus, identique — mais pas bout à bout', () => {
  assert.ok(rangesOverlap(0, 10, 5, 15))
  assert.ok(rangesOverlap(0, 10, 2, 3))
  assert.ok(rangesOverlap(0, 10, 0, 10))
  assert.ok(!rangesOverlap(0, 10, 10, 20))
  assert.ok(!rangesOverlap(10, 20, 0, 10))
})

test('créneaux : horaires, jours fermés, réservations et annulations', () => {
  const slots = getDaySlots({ dateKey: '2026-10-26', durationMin: 60, consultantId: 'clara', bookings: [], now })
  assert.equal(slots[0].start, '2026-10-26T08:30:00.000Z')
  assert.equal(slots.length, 13)
  assert.equal(getDaySlots({ dateKey: '2026-10-25', durationMin: 60, consultantId: 'clara', bookings: [], now }).length, 0, 'dimanche fermé')
  const statuses = getDaySlots({ dateKey: '2026-10-26', durationMin: 60, consultantId: 'clara', bookings: [booked()], now }).slice(0, 4).map((s) => s.status)
  assert.deepEqual(statuses, ['booked', 'booked', 'booked', 'available'])
  const freed = getDaySlots({ dateKey: '2026-10-26', durationMin: 60, consultantId: 'clara', bookings: [booked({ status: 'cancelled' })], now })
  assert.ok(freed.every((s) => s.status === 'available'), 'une annulation libère le créneau')
})

test('créneaux passés ou à moins de 2 h refusés', () => {
  const sameDay = getDaySlots({ dateKey: '2026-10-26', durationMin: 30, consultantId: 'clara', bookings: [], now: new Date('2026-10-26T09:00:00Z') })
  assert.equal(sameDay.filter((s) => s.status === 'past').length, 5)
  assert.equal(sameDay.find((s) => s.status === 'available').start, '2026-10-26T11:00:00.000Z')
})

test('deuxième vérification : refuse les demandes invalides ou en conflit', () => {
  const req = { consultationTypeId: 'projet-amenagement', consultantId: 'clara', format: 'visio', start: '2026-10-26T10:00:00.000Z', customer: { email: 'a@exemple.fr' } }
  assert.equal(checkBookingRequest(req, [], now), null)
  assert.equal(checkBookingRequest({ ...req, start: '2026-10-26T09:30:00.000Z' }, [booked()], now), 'SLOT_TAKEN')
  assert.equal(checkBookingRequest({ ...req, start: '2026-10-26T10:15:00.000Z' }, [], now), 'INVALID_REQUEST')
  assert.equal(checkBookingRequest({ ...req, consultantId: 'ines' }, [], now), 'INVALID_REQUEST')
  assert.equal(checkBookingRequest(req, [], new Date('2026-10-26T09:00:00Z')), 'SLOT_IN_PAST')
  const mine = [booked({ id: 'm', consultantId: 'hugo', start: '2026-10-26T10:30:00.000Z', end: '2026-10-26T11:00:00.000Z', customer: { email: 'A@exemple.fr' } })]
  assert.equal(checkBookingRequest(req, mine, now), 'CLIENT_OVERLAP')
  assert.equal(checkBookingRequest({ ...req, replacesBookingId: 'm' }, mine, now), null)
})

test('jours réservables et prochains créneaux', () => {
  const days = getBookableDays({ durationMin: 30, consultantId: 'ines', bookings: [], now })
  assert.equal(days.length, 21)
  assert.equal(days[0].dateKey, '2026-10-20')
  const next = findNextAvailableSlots({ consultationTypeId: 'decouverte', bookings: [], now: new Date('2026-10-24T20:00:00Z') })
  assert.equal(next[0].start, '2026-10-26T08:30:00.000Z')
  assert.equal(new Set(next.map((s) => s.start)).size, 3)
})

test('coordonnées : messages d’erreur compréhensibles', () => {
  assert.deepEqual(Object.keys(validateContact({ name: 'A', email: 'faux', message: '' })), ['name', 'email'])
  assert.deepEqual(validateContact({ name: 'Alex', email: 'alex@exemple.fr', message: '' }), {})
})
