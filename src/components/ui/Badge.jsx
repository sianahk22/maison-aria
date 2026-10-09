// Les fonds clairs (sauge, or, sable) sont toujours combinés avec un texte foncé pour rester lisibles.
const tones = {
  neutral: 'bg-sand text-espresso',
  sage: 'bg-sage/35 text-ink',
  gold: 'bg-gold/30 text-ink',
  terracotta: 'bg-terracotta-deep text-white',
  dark: 'bg-ink text-ivory',
  outline: 'border border-ink/15 text-stone-deep',
}

export function Badge({ tone = 'neutral', className = '', ...props }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${tones[tone]} ${className}`}
      {...props}
    />
  )
}

export function DemoDataBadge({ className = '' }) {
  return (
    <Badge tone="outline" className={className}>
      Données de démonstration
    </Badge>
  )
}
