import { RadioCard } from '../../components/ui/RadioCard'
import { formatTime } from './time'

// Les créneaux passés sont masqués ; les créneaux réservés restent visibles mais désactivés.
export function SlotPicker({ slots, value, onChange }) {
  const visible = slots.filter((slot) => slot.status !== 'past')

  if (visible.length === 0) {
    return <p className="text-sm text-stone-deep">Plus aucun créneau ce jour-là. Choisissez une autre date.</p>
  }

  return (
    <fieldset>
      <legend className="sr-only">Heure du rendez-vous</legend>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {visible.map((slot) => {
          const booked = slot.status === 'booked'
          return (
            <RadioCard
              key={slot.start}
              name="booking-slot"
              value={slot.start}
              checked={value === slot.start}
              onChange={() => onChange(slot.start)}
              disabled={booked}
              className="flex min-h-12 items-center justify-center px-2 py-3 text-sm font-medium"
            >
              <span className={booked ? 'line-through' : ''}>{formatTime(slot.start)}</span>
              {booked && <span className="sr-only"> (déjà réservé)</span>}
            </RadioCard>
          )
        })}
      </div>
      <p className="mt-3 text-xs text-stone-deep">Les horaires barrés sont déjà réservés. Heure de Paris.</p>
    </fieldset>
  )
}
