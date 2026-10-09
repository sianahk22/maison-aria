import { Icon } from './Icon'

// Sélecteur de quantité accessible : boutons − / + et champ numérique libellé.
export function QuantityInput({ id, label, value, onChange, min = 1, max = 10 }) {
  const set = (next) => onChange(Math.min(max, Math.max(min, next)))

  return (
    <div className="inline-flex items-center rounded-full border border-ink/15 bg-white">
      <button
        type="button"
        onClick={() => set(value - 1)}
        disabled={value <= min}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-sand disabled:opacity-40"
      >
        <Icon name="minus" className="h-4 w-4" />
        <span className="sr-only">Diminuer la quantité</span>
      </button>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(event) => {
          const next = Number.parseInt(event.target.value, 10)
          if (Number.isFinite(next)) set(next)
        }}
        className="w-10 [appearance:textfield] bg-transparent text-center font-medium [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => set(value + 1)}
        disabled={value >= max}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-sand disabled:opacity-40"
      >
        <Icon name="plus" className="h-4 w-4" />
        <span className="sr-only">Augmenter la quantité</span>
      </button>
    </div>
  )
}
