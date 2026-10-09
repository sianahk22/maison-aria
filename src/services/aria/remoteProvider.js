// Fournisseur « IA réelle » : appelle la fonction serveur /api/concierge, qui détient la clé.
// Le navigateur ne voit jamais la clé. En cas d'échec, conciergeService repasse en mode simulé.
const ENDPOINT = '/api/concierge'

let statusPromise

// Mode réellement disponible : 'ai' seulement si le serveur répond qu'une clé est configurée.
// En local (npm run dev), la fonction serveur n'existe pas : le mode reste 'simulated'.
export function getRemoteStatus() {
  statusPromise ??= fetch(ENDPOINT, { headers: { Accept: 'application/json' } })
    .then(async (response) => {
      const isJson = response.headers.get('content-type')?.includes('application/json')
      if (!response.ok || !isJson) return 'simulated'
      const data = await response.json()
      return data.mode === 'ai' ? 'ai' : 'simulated'
    })
    .catch(() => 'simulated')
  return statusPromise
}

export const remoteProvider = {
  mode: 'ai',
  label: 'IA Claude (Anthropic) · recommandations vérifiées par le catalogue',
  async reply({ message, contextProductId }) {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ message, contextProductId }),
      signal: AbortSignal.timeout(30_000),
    })
    if (!response.ok) throw new Error(`ARIA indisponible (${response.status})`)
    return response.json()
  },
}
