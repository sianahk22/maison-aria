import { RadioCard } from '../../components/ui/RadioCard'
import { formatDayParts } from './time'

export function DayPicker({ days, value, onChange }) {
  return (
    <fieldset>
      <legend className="sr-only">Date du rendez-vous</legend>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7">
        {days.map((day) => {
          const { weekday, day: dayNumber, month } = formatDayParts(day.dateKey)
          const disabled = day.availableCount === 0
          const status = !day.isOpen ? 'Fermé' : disabled ? 'Complet' : `${day.availableCount} créneaux`
          return (
            <RadioCard
              key={day.dateKey}
              name="booking-day"
              value={day.dateKey}
              checked={value === day.dateKey}
              onChange={() => onChange(day.dateKey)}
              disabled={disabled}
              className="px-2 py-3 text-center"
            >
              <span className="block text-xs capitalize">{weekday.replace('.', '')}</span>
              <span className="block font-serif text-2xl leading-tight">{dayNumber}</span>
              <span className="block text-xs">{month}</span>
              <span className="mt-1 block text-[11px] opacity-80">{status}</span>
            </RadioCard>
          )
        })}
      </div>
    </fieldset>
  )
}
