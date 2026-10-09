// Briques visuelles du tableau de bord (sans bibliothèque de graphiques : de simples barres CSS).

export function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-3xl bg-white p-5 sm:p-6">
      <p className="text-sm text-stone-deep">{label}</p>
      <p className="mt-2 font-serif text-4xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-stone-deep">{hint}</p>}
    </div>
  )
}

export function Panel({ id, title, className = '', children }) {
  return (
    <section aria-labelledby={id} className={`rounded-3xl bg-white p-5 sm:p-6 ${className}`}>
      <h2 id={id} className="font-serif text-2xl">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

// Liste de barres horizontales. La valeur est écrite en texte : l'information ne dépend pas de la couleur.
export function BarList({ items, colorClass = 'bg-terracotta' }) {
  const max = Math.max(1, ...items.map((item) => item.value))
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label}>
          <div className="flex justify-between gap-3 text-sm">
            <span className="min-w-0 truncate">{item.label}</span>
            <span className="shrink-0 font-medium">{item.value}</span>
          </div>
          <div className="mt-1.5 h-2 rounded-full bg-sand" aria-hidden="true">
            <div className={`h-2 rounded-full ${colorClass}`} style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}
