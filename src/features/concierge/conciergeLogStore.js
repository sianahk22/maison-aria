import { createStore } from '../../lib/createStore'

// Journal des demandes faites à ARIA dans CE navigateur (alimente le tableau de bord de démo).
// Rien n'est envoyé à un serveur. Limité aux 30 dernières demandes.
export const conciergeLogStore = createStore({
  initialState: () => ({ requests: [] }),
  persist: {
    key: 'aura-studio:concierge-log',
    version: 1,
    validate: (state) => Array.isArray(state?.requests),
  },
})

export function logConciergeRequest({ text, intent, resultCount }) {
  conciergeLogStore.setState((state) => ({
    requests: [
      { id: crypto.randomUUID(), text: text.slice(0, 200), intent, resultCount, at: new Date().toISOString() },
      ...state.requests,
    ].slice(0, 30),
  }))
}
