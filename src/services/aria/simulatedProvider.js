// Fournisseur SIMULÉ d'ARIA Concierge : moteur de règles local, aucune IA, aucune donnée envoyée.
// Un futur fournisseur « IA » exposera la même méthode `reply` (voir README, « Brancher une vraie IA »).
import { recommend } from '../../lib/recommendationEngine'
import { wait } from '../../lib/wait'

export const simulatedProvider = {
  mode: 'simulated',
  label: 'Assistant simulé · aucune IA connectée',
  async reply({ message, contextProductId, products }) {
    await wait(700 + Math.random() * 500) // « réflexion » simulée
    return recommend(message, products, { contextProductId })
  },
}
