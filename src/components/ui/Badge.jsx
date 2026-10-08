// Les fonds clairs (sauge, or) sont combinés avec du texte charbon pour garder un contraste suffisant.
const tones = {
  neutral: 'bg-charcoal/5 text-charcoal',
  sage: 'bg-sage/40 text-charcoal',
  gold: 'bg-gold/30 text-charcoal',
  terracotta: 'bg-terracotta-deep text-white',
}

export function Badge({ tone = 'neutral', className = '', ...props }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${tones[tone]} ${className}`}
      {...props}
    />
  )
}
