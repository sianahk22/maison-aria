// Bouton radio natif habillé en carte : navigation au clavier (flèches) et lecteurs d'écran
// fonctionnent sans code supplémentaire, car c'est un vrai <input type="radio">.
export function RadioCard({ name, value, checked, onChange, disabled = false, className = '', children }) {
  return (
    <label className={`block h-full ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="peer sr-only"
      />
      <span
        className={`block h-full rounded-2xl border border-ink/12 bg-white transition peer-checked:border-ink peer-checked:bg-ink peer-checked:text-ivory peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-terracotta-deep peer-disabled:border-dashed peer-disabled:bg-transparent peer-disabled:text-stone-deep ${
          disabled ? '' : 'hover:border-ink'
        } ${className}`}
      >
        {children}
      </span>
    </label>
  )
}
