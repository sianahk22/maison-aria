// Gestion du fuseau horaire du showroom (Europe/Paris), sans bibliothèque.
// Les réservations sont stockées en UTC (ISO 8601) ; on convertit seulement pour calculer
// les horaires d'ouverture et pour l'affichage. Les changements d'heure été/hiver sont gérés
// par l'API Intl du navigateur.
const TIME_ZONE = 'Europe/Paris'

const partsFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

function parisParts(date) {
  return Object.fromEntries(partsFormatter.formatToParts(date).map((part) => [part.type, part.value]))
}

// Écart (en ms) entre l'heure de Paris et l'heure UTC à un instant donné (+1 h ou +2 h).
function parisOffset(timestamp) {
  const p = parisParts(new Date(timestamp))
  const wallClockAsUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute)
  return wallClockAsUtc - Math.floor(timestamp / 60000) * 60000
}

// « 2026-10-14 » à Paris pour un instant donné.
export function toDateKey(date) {
  const p = parisParts(date)
  return `${p.year}-${p.month}-${p.day}`
}

// « 2026-10-14 » + « 09:30 » (heure de Paris) → instant UTC correspondant.
export function parisTimeToDate(dateKey, time) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const [hours, minutes] = time.split(':').map(Number)
  const wallClockAsUtc = Date.UTC(year, month - 1, day, hours, minutes)
  const firstGuess = wallClockAsUtc - parisOffset(wallClockAsUtc)
  return new Date(wallClockAsUtc - parisOffset(firstGuess))
}

const keyToUtcNoon = (dateKey) => {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day, 12))
}

export function addDays(dateKey, days) {
  const date = keyToUtcNoon(dateKey)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

export function weekdayOf(dateKey) {
  return keyToUtcNoon(dateKey).getUTCDay()
}

// ── Affichage (toujours en heure de Paris) ──────────────────────────────────
const dayFormatter = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })
const longDayFormatter = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: TIME_ZONE,
})
const timeFormatter = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: TIME_ZONE })

export const formatDayParts = (dateKey) => {
  const parts = Object.fromEntries(dayFormatter.formatToParts(keyToUtcNoon(dateKey)).map((p) => [p.type, p.value]))
  return { weekday: parts.weekday, day: parts.day, month: parts.month }
}
export const formatLongDate = (iso) => longDayFormatter.format(new Date(iso))
export const formatTime = (iso) => timeFormatter.format(new Date(iso))
export const formatSlot = (start, end) => `${formatLongDate(start)}, ${formatTime(start)} – ${formatTime(end)}`
