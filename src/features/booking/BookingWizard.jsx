import { useEffect, useRef, useState } from 'react'
import { DEMO_BOOKING_NOTICE } from '../../app/brand'
import { ROUTES } from '../../app/routes'
import { Badge } from '../../components/ui/Badge'
import { Button, ButtonLink } from '../../components/ui/Button'
import { Field } from '../../components/ui/Field'
import { Icon } from '../../components/ui/Icon'
import { RadioCard } from '../../components/ui/RadioCard'
import { CONSULTATION_TYPES, FORMATS } from '../../data/consultations'
import { formatPrice } from '../../lib/format'
import { useNow } from '../../lib/useNow'
import { createBooking, simulateCompetingBooking } from '../../services/bookingService'
import {
  consultantsFor,
  findConsultant,
  findConsultationType,
  getBookableDays,
  getDaySlots,
  validateContact,
} from './availability'
import { BookingSummary } from './BookingSummary'
import { DayPicker } from './DayPicker'
import { SlotPicker } from './SlotPicker'
import { formatLongDate, formatTime } from './time'
import { useBookings } from './useBookings'

const EMPTY_CONTACT = { name: '', email: '', message: '' }

function initialState(reschedule, preselectedTypeId) {
  if (reschedule) {
    return {
      selection: {
        consultationTypeId: reschedule.consultationTypeId,
        consultantId: reschedule.consultantId,
        format: reschedule.format,
        dateKey: null,
        slotStart: null,
      },
      contact: { ...reschedule.customer },
    }
  }
  return {
    selection: {
      consultationTypeId: findConsultationType(preselectedTypeId) ? preselectedTypeId : null,
      consultantId: null,
      format: null,
      dateKey: null,
      slotStart: null,
    },
    contact: EMPTY_CONTACT,
  }
}

function Step({ number, title, hint, children }) {
  return (
    <section aria-labelledby={`step-${number}`} className="border-t border-ink/10 py-8 first:border-t-0 first:pt-0">
      <h2 id={`step-${number}`} className="flex items-baseline gap-3 font-serif text-2xl">
        <span className="text-base text-terracotta-deep">{String(number).padStart(2, '0')}</span>
        {title}
      </h2>
      <div className="mt-5">{children ?? <p className="text-sm text-stone-deep">{hint}</p>}</div>
    </section>
  )
}

export function BookingWizard({ reschedule: rescheduleProp, preselectedTypeId, onConfirmed, onRestart }) {
  // Copie figée du rendez-vous à modifier : une fois la modification confirmée, l'original passe
  // à « annulé » et disparaît des props, mais l'écran de confirmation doit encore en parler.
  const [reschedule] = useState(rescheduleProp)
  const bookings = useBookings()
  const now = useNow()
  const [{ selection, contact }, setForm] = useState(() => initialState(reschedule, preselectedTypeId))
  const [contactErrors, setContactErrors] = useState({})
  const [phase, setPhase] = useState('select') // 'select' → 'review' → 'confirmed'
  const [requestId, setRequestId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [alert, setAlert] = useState(null)
  const [confirmed, setConfirmed] = useState(null)
  const inFlight = useRef(false)
  const phaseHeadingRef = useRef(null)
  const alertRef = useRef(null)

  // ── Données dérivées (recalculées à chaque rendu, jamais stockées) ──────────
  const type = findConsultationType(selection.consultationTypeId)
  const consultants = type ? consultantsFor(type.id) : []
  const consultant = consultants.find((item) => item.id === selection.consultantId) ?? null
  const formats = consultant ? FORMATS.filter((format) => consultant.formatIds.includes(format.id)) : []
  const slotQuery = type && consultant && {
    durationMin: type.durationMin,
    consultantId: consultant.id,
    bookings,
    now,
    ignoreBookingId: reschedule?.id,
  }
  const days = slotQuery ? getBookableDays(slotQuery) : []
  const slots = slotQuery && selection.dateKey ? getDaySlots({ ...slotQuery, dateKey: selection.dateKey }) : []
  const selectedSlot = slots.find((slot) => slot.start === selection.slotStart)
  // Le créneau choisi a pu être pris entre-temps (autre onglet, temps qui passe) : on le signale.
  const slotLost = Boolean(selection.slotStart) && selectedSlot?.status !== 'available'

  useEffect(() => {
    if (phase !== 'select') phaseHeadingRef.current?.focus()
  }, [phase])

  useEffect(() => {
    if (alert) alertRef.current?.focus()
  }, [alert])

  // ── Mise à jour de la sélection : chaque choix réinitialise ceux qui en dépendent ──
  const select = (changes) => setForm((form) => ({ ...form, selection: { ...form.selection, ...changes } }))

  function chooseType(consultationTypeId) {
    const stillValid = consultantsFor(consultationTypeId).some((item) => item.id === selection.consultantId)
    select({ consultationTypeId, slotStart: null, ...(stillValid ? {} : { consultantId: null, format: null, dateKey: null }) })
  }

  function chooseConsultant(consultantId) {
    const { formatIds } = findConsultant(consultantId)
    const format = formatIds.includes(selection.format) ? selection.format : formatIds.length === 1 ? formatIds[0] : null
    select({ consultantId, format, dateKey: null, slotStart: null })
  }

  const updateContact = (field, value) => {
    setForm((form) => ({ ...form, contact: { ...form.contact, [field]: value } }))
    if (contactErrors[field]) setContactErrors((errors) => ({ ...errors, [field]: undefined }))
  }

  function goToReview(event) {
    event.preventDefault()
    const errors = validateContact(contact)
    setContactErrors(errors)
    const missing = [
      !type && 'le type de consultation',
      !consultant && 'le ou la consultant·e',
      !selection.format && 'le format',
      (!selectedSlot || slotLost) && 'un créneau disponible',
    ].filter(Boolean)

    if (missing.length > 0 || Object.keys(errors).length > 0) {
      setAlert(
        missing.length > 0
          ? `Il manque encore : ${missing.join(', ')}.`
          : 'Merci de corriger les champs signalés dans vos coordonnées.',
      )
      return
    }
    setAlert(null)
    setRequestId(crypto.randomUUID()) // clé d'idempotence de CETTE demande
    setPhase('review')
  }

  const request = selectedSlot && {
    requestId,
    consultationTypeId: type.id,
    consultantId: consultant.id,
    format: selection.format,
    start: selectedSlot.start,
    end: selectedSlot.end,
    customer: contact,
    replacesBookingId: reschedule?.id,
  }

  async function confirm() {
    // Garde synchrone : deux clics dans la même fraction de seconde ne passent pas.
    if (inFlight.current) return
    inFlight.current = true
    setSubmitting(true)
    try {
      const booking = await createBooking(request)
      setConfirmed(booking)
      setPhase('confirmed')
      onConfirmed?.(booking)
    } catch (error) {
      select({ slotStart: null })
      setPhase('select')
      setAlert(error.message)
    } finally {
      inFlight.current = false
      setSubmitting(false)
    }
  }

  // ── Écran 3 : confirmation ──────────────────────────────────────────────────
  if (phase === 'confirmed') {
    return (
      <div className="mx-auto max-w-2xl animate-fade-up rounded-3xl bg-white p-6 sm:p-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage/40">
          <Icon name="check" />
        </span>
        <h2 ref={phaseHeadingRef} tabIndex={-1} className="mt-6 font-serif text-3xl focus:outline-none sm:text-4xl">
          {reschedule ? 'Rendez-vous modifié' : 'Réservation confirmée'}
        </h2>
        <p className="mt-3 text-stone-deep">
          {DEMO_BOOKING_NOTICE} Aucun email n’a été envoyé. Référence de démonstration :{' '}
          <span className="font-mono text-ink">{confirmed.id}</span>
        </p>
        <div className="mt-6">
          <BookingSummary booking={confirmed} />
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink to={ROUTES.account}>Voir mes rendez-vous</ButtonLink>
          <Button variant="secondary" onClick={onRestart}>
            Faire une nouvelle réservation
          </Button>
        </div>
      </div>
    )
  }

  // ── Écran 2 : récapitulatif avant confirmation ──────────────────────────────
  if (phase === 'review') {
    return (
      <div className="mx-auto max-w-2xl animate-fade-up rounded-3xl bg-white p-6 sm:p-10">
        <h2 ref={phaseHeadingRef} tabIndex={-1} className="font-serif text-3xl focus:outline-none">
          Vérifiez votre réservation
        </h2>
        <p className="mt-2 text-sm text-stone-deep">{DEMO_BOOKING_NOTICE}</p>

        <div className="mt-6">
          <BookingSummary booking={request} />
        </div>
        {slotLost && (
          <p role="alert" className="mt-4 rounded-2xl bg-terracotta-deep/10 p-4 text-sm text-terracotta-deep">
            Attention : ce créneau ne semble plus disponible. La confirmation va le vérifier.
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={confirm} disabled={submitting} aria-busy={submitting} className="sm:flex-1">
            {submitting ? 'Vérification du créneau…' : 'Confirmer la réservation'}
          </Button>
          <Button variant="secondary" size="lg" onClick={() => setPhase('select')} disabled={submitting}>
            Modifier
          </Button>
        </div>

        <details className="mt-8 rounded-2xl border border-dashed border-ink/20 p-4 text-sm">
          <summary className="cursor-pointer font-medium">Mode démonstration : tester un conflit</summary>
          <p className="mt-3 leading-relaxed text-stone-deep">
            Simule une autre personne qui réserve ce même créneau pendant que vous relisez. En
            confirmant ensuite, la deuxième vérification détectera le conflit et vous proposera un
            autre horaire.
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-3"
            disabled={submitting}
            onClick={() => simulateCompetingBooking(request)}
          >
            Simuler une réservation concurrente
          </Button>
        </details>
      </div>
    )
  }

  // ── Écran 1 : sélection ─────────────────────────────────────────────────────
  return (
    <form noValidate onSubmit={goToReview} className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
      <div>
        {alert && (
          <div
            ref={alertRef}
            tabIndex={-1}
            role="alert"
            className="mb-8 flex gap-3 rounded-2xl bg-terracotta-deep/10 p-4 text-sm text-terracotta-deep focus:outline-none"
          >
            <Icon name="alert" className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{alert}</p>
          </div>
        )}

        <Step number={1} title="Type de consultation">
          <fieldset>
            <legend className="sr-only">Type de consultation</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {CONSULTATION_TYPES.map((item) => (
                <RadioCard
                  key={item.id}
                  name="consultation-type"
                  value={item.id}
                  checked={selection.consultationTypeId === item.id}
                  onChange={() => chooseType(item.id)}
                  className="p-5"
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="font-serif text-xl">{item.name}</span>
                    <span className="shrink-0 text-sm">{item.durationMin} min</span>
                  </span>
                  <span className="mt-2 block text-sm opacity-80">{item.description}</span>
                  <span className="mt-3 block text-sm font-medium">
                    {item.price === 0 ? 'Offerte' : `${formatPrice(item.price)} · tarif fictif`}
                  </span>
                </RadioCard>
              ))}
            </div>
          </fieldset>
        </Step>

        <Step number={2} title="Consultant·e" hint="Choisissez d’abord un type de consultation.">
          {type && (
            <fieldset>
              <legend className="sr-only">Consultant ou consultante</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {consultants.map((item) => (
                  <RadioCard
                    key={item.id}
                    name="consultant"
                    value={item.id}
                    checked={selection.consultantId === item.id}
                    onChange={() => chooseConsultant(item.id)}
                    className="flex items-center gap-3 p-4"
                  >
                    <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sand font-serif text-ink">
                      {item.name.split(' ').map((part) => part[0]).join('')}
                    </span>
                    <span>
                      <span className="block font-medium">{item.name}</span>
                      <span className="block text-xs opacity-80">{item.title}</span>
                    </span>
                  </RadioCard>
                ))}
              </div>
              <p className="mt-3 text-xs text-stone-deep">Consultants fictifs, créés pour la démonstration.</p>
            </fieldset>
          )}
        </Step>

        <Step number={3} title="Format" hint="Choisissez d’abord un·e consultant·e.">
          {consultant && (
            <fieldset>
              <legend className="sr-only">Format du rendez-vous</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {formats.map((format) => (
                  <RadioCard
                    key={format.id}
                    name="format"
                    value={format.id}
                    checked={selection.format === format.id}
                    onChange={() => select({ format: format.id })}
                    className="p-4"
                  >
                    <span className="block font-medium">{format.label}</span>
                    <span className="block text-xs opacity-80">{format.description}</span>
                  </RadioCard>
                ))}
              </div>
              {formats.length === 1 && (
                <p className="mt-3 text-xs text-stone-deep">{consultant.name} reçoit uniquement {formats[0].label.toLowerCase()}.</p>
              )}
            </fieldset>
          )}
        </Step>

        <Step number={4} title="Date" hint="Choisissez d’abord un·e consultant·e.">
          {consultant && <DayPickerSection days={days} value={selection.dateKey} onChange={(dateKey) => select({ dateKey, slotStart: null })} />}
        </Step>

        <Step number={5} title="Heure" hint="Choisissez d’abord une date.">
          {selection.dateKey && (
            <>
              <SlotPicker slots={slots} value={selection.slotStart} onChange={(slotStart) => select({ slotStart })} />
              {slotLost && (
                <p role="alert" className="mt-3 text-sm text-terracotta-deep">
                  Le créneau sélectionné n’est plus disponible. Merci d’en choisir un autre.
                </p>
              )}
            </>
          )}
        </Step>

        <Step number={6} title="Vos coordonnées">
          <div className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id="booking-name"
                label="Nom"
                required
                autoComplete="name"
                value={contact.name}
                error={contactErrors.name}
                onChange={(event) => updateContact('name', event.target.value)}
              />
              <Field
                id="booking-email"
                label="Email"
                type="email"
                required
                autoComplete="email"
                hint="Utilisez une adresse fictive : aucun email ne sera envoyé."
                value={contact.email}
                error={contactErrors.email}
                onChange={(event) => updateContact('email', event.target.value)}
              />
            </div>
            <Field
              id="booking-message"
              label="Message"
              as="textarea"
              rows={4}
              maxLength={500}
              placeholder="Pièce concernée, surface, style recherché…"
              value={contact.message}
              error={contactErrors.message}
              onChange={(event) => updateContact('message', event.target.value)}
            />
          </div>
        </Step>
      </div>

      <aside aria-label="Votre sélection" className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-3xl bg-white p-6">
          <Badge tone="gold">Démonstration</Badge>
          <h2 className="mt-4 font-serif text-2xl">Votre sélection</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>{type ? `${type.name} · ${type.durationMin} min` : 'Type de consultation à choisir'}</li>
            <li>{consultant ? consultant.name : 'Consultant·e à choisir'}</li>
            <li>{FORMATS.find((format) => format.id === selection.format)?.label ?? 'Format à choisir'}</li>
            <li>
              {selectedSlot && !slotLost
                ? `${formatLongDate(selectedSlot.start)} à ${formatTime(selectedSlot.start)}`
                : 'Créneau à choisir'}
            </li>
          </ul>
          <Button type="submit" size="lg" className="mt-6 w-full">
            Vérifier ma réservation
          </Button>
          <p className="mt-4 text-xs leading-relaxed text-stone-deep">{DEMO_BOOKING_NOTICE}</p>
          {reschedule && (
            <p className="mt-2 text-xs leading-relaxed text-stone-deep">
              Modification du rendez-vous du {formatLongDate(reschedule.start)} à {formatTime(reschedule.start)} :
              l’ancien créneau sera libéré à la confirmation.
            </p>
          )}
        </div>
      </aside>
    </form>
  )
}

function DayPickerSection({ days, value, onChange }) {
  return days.some((day) => day.availableCount > 0) ? (
    <DayPicker days={days} value={value} onChange={onChange} />
  ) : (
    <p className="text-sm text-stone-deep">Aucun créneau libre sur les 3 prochaines semaines pour ce choix.</p>
  )
}


