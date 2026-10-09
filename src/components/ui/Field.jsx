// Champ de formulaire libellé, avec message d'erreur relié (aria-describedby) pour les lecteurs d'écran.
const inputClass =
  'w-full rounded-2xl border bg-white px-4 py-3 text-base text-ink placeholder:text-stone-deep/70 focus:border-ink'

export function Field({ id, label, error, hint, as = 'input', required = false, ...props }) {
  const Component = as
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        {required ? <span aria-hidden="true"> *</span> : <span className="font-normal text-stone-deep"> (facultatif)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-stone-deep">
          {hint}
        </p>
      )}
      <Component
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`mt-2 ${inputClass} ${error ? 'border-terracotta-deep' : 'border-ink/15'}`}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-terracotta-deep">
          {error}
        </p>
      )}
    </div>
  )
}
