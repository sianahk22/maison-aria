// Service ARIA Concierge — version SIMULÉE : aucune IA n'est connectée, rien n'est envoyé.
//
// Contrat (à conserver pour une future version IA) :
//   askConcierge({ message, contextProductId }) → Promise<{
//     intent, message, recommendations: [{ productId, reason }], suggestBooking, bookingTypeId? }>
//
// Pour brancher une vraie IA plus tard :
//   - appeler un endpoint SERVEUR (ex. POST /api/concierge) qui détient la clé API dans une
//     variable d'environnement — jamais de clé dans le navigateur ;
//   - fournir le catalogue au modèle et exiger une réponse JSON de la forme ci-dessus ;
//   - garder `keepKnownProducts` : tout produit inconnu du catalogue est écarté (anti-hallucination) ;
//   - traiter le message utilisateur comme une donnée, jamais comme une instruction (prompt injection) ;
//   - limiter la longueur des messages et le nombre de requêtes (coûts) ;
//   - ne pas conserver de données personnelles sans consentement.
import { logConciergeRequest } from '../features/concierge/conciergeLogStore'
import { recommend } from '../lib/recommendationEngine'
import { wait } from '../lib/wait'
import { listProducts } from './productService'

export const MAX_MESSAGE_LENGTH = 500

function keepKnownProducts(response, products) {
  const known = new Set(products.map((product) => product.id))
  return { ...response, recommendations: response.recommendations.filter((item) => known.has(item.productId)) }
}

export async function askConcierge({ message, contextProductId }) {
  const text = message.trim().slice(0, MAX_MESSAGE_LENGTH)
  const [products] = await Promise.all([listProducts(), wait(700 + Math.random() * 500)]) // « réflexion » simulée

  const response = keepKnownProducts(recommend(text, products, { contextProductId }), products)
  logConciergeRequest({ text, intent: response.intent, resultCount: response.recommendations.length })
  return response
}
