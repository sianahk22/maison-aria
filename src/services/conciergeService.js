// Service ARIA Concierge : point d'entrée unique utilisé par l'interface du chat.
//
//   askConcierge({ message, contextProductId }) → Promise<{
//     intent, message, recommendations: [{ productId, reason }], suggestBooking, bookingTypeId?,
//     source: 'ai' | 'simulated' }>
//
// Séparation des rôles :
//   - fournisseurs (services/aria/) : IA réelle via le serveur (remoteProvider) ou règles locales
//     (simulatedProvider) ;
//   - garde-fou (services/aria/responseGuard.js) : vérifie TOUTE réponse avant affichage ;
//   - ce service : choisit le fournisseur, limite les messages, journalise, gère les erreurs.
//
// Le mode IA n'est utilisé que si le serveur confirme qu'une clé est configurée. Sinon, ou si
// l'appel échoue, la réponse vient du mode simulé — et `source` le dit honnêtement à l'interface.
// ARIA ne réserve, ne paie et ne décide jamais d'une disponibilité : elle peut seulement SUGGÉRER
// une consultation. La réservation reste contrôlée par bookingService.
import { logConciergeRequest } from '../features/concierge/conciergeLogStore'
import { getRemoteStatus, remoteProvider } from './aria/remoteProvider'
import { guardConciergeResponse } from './aria/responseGuard'
import { simulatedProvider } from './aria/simulatedProvider'
import { listProducts } from './productService'

export const MAX_MESSAGE_LENGTH = 500

const PROVIDERS = { ai: remoteProvider, simulated: simulatedProvider }

// Promesse mise en cache (utilisable avec `use`) : { mode, label }.
let modePromise
export function getAriaMode() {
  modePromise ??= getRemoteStatus().then((mode) => ({ mode, label: PROVIDERS[mode].label }))
  return modePromise
}

export async function askConcierge({ message, contextProductId }) {
  const text = message.trim().slice(0, MAX_MESSAGE_LENGTH)
  const [products, { mode }] = await Promise.all([listProducts(), getAriaMode()])

  let raw
  let source = 'simulated'
  if (mode === 'ai') {
    try {
      raw = await remoteProvider.reply({ message: text, contextProductId })
      source = 'ai'
    } catch {
      raw = undefined // repli ci-dessous
    }
  }
  raw ??= await simulatedProvider.reply({ message: text, contextProductId, products })

  const response = { ...guardConciergeResponse(raw, products), source, fallback: mode === 'ai' && source === 'simulated' }
  logConciergeRequest({ text, intent: response.intent, resultCount: response.recommendations.length })
  return response
}
