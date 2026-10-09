// Formatage centralisé : les prix sont stockés en centimes (entiers) pour éviter
// les erreurs d'arrondi des nombres décimaux en JavaScript (0.1 + 0.2 !== 0.3).
const euro = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

export function formatPrice(cents) {
  return euro.format(cents / 100)
}

export function formatDimensions({ width, depth, height }) {
  return `L ${width} × P ${depth} × H ${height} cm`
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count > 1 ? plural : singular}`
}
