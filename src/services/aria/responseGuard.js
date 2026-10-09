// Garde-fou appliqué à TOUTE réponse d'ARIA, quel que soit le fournisseur (simulé ou IA réelle).
// Une IA peut « halluciner » : produit inexistant, texte trop long, intention inconnue…
// On ne fait confiance qu'à ce qui est vérifiable dans les données de l'application.
import { CONSULTATION_TYPES } from '../../data/consultations.js'

const INTENTS = ['recommendation', 'advisor', 'no_match', 'greeting', 'unknown']
const MAX_RECOMMENDATIONS = 3
const MAX_MESSAGE = 600
const MAX_REASON = 160
const FALLBACK_MESSAGE = 'Je n’ai pas pu formuler de réponse fiable. Reformulez votre demande ou parlez-en à un conseiller.'

const clip = (text, max) => (typeof text === 'string' ? text.trim().slice(0, max) : '')

export function guardConciergeResponse(raw, products) {
  const known = new Set(products.map((product) => product.id))
  const recommendations = (Array.isArray(raw?.recommendations) ? raw.recommendations : [])
    .filter((item) => known.has(item?.productId)) // produit inconnu du catalogue → écarté
    .slice(0, MAX_RECOMMENDATIONS)
    .map((item) => ({ productId: item.productId, reason: clip(item.reason, MAX_REASON) }))

  const intent = INTENTS.includes(raw?.intent) ? raw.intent : 'unknown'
  const suggestBooking = raw?.suggestBooking === true
  const bookingTypeId = CONSULTATION_TYPES.some((type) => type.id === raw?.bookingTypeId) ? raw.bookingTypeId : 'decouverte'

  return {
    intent,
    message: clip(raw?.message, MAX_MESSAGE) || FALLBACK_MESSAGE,
    recommendations,
    suggestBooking,
    ...(suggestBooking ? { bookingTypeId } : {}),
  }
}
