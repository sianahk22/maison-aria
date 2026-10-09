// Mini « store » : un état partagé hors de React, avec abonnement.
// Avec `persist`, l'état est sauvegardé dans localStorage et synchronisé entre onglets.
//
// Pourquoi pas un simple useState ? Le panier ou les réservations sont lus par plusieurs
// composants éloignés (en-tête, pages, tableau de bord) : un store évite de les faire
// transiter de parent en enfant. Pour une vraie base de données, seuls les services changeront.

function readStorage(key, version, validate) {
  try {
    const raw = globalThis.localStorage?.getItem(key)
    if (!raw) return null
    const saved = JSON.parse(raw)
    // Une donnée d'une ancienne version (ou modifiée à la main) est ignorée plutôt que de casser l'app.
    if (saved?.version !== version || !validate(saved.state)) return null
    return saved.state
  } catch {
    return null
  }
}

function writeStorage(key, version, state) {
  try {
    globalThis.localStorage?.setItem(key, JSON.stringify({ version, state }))
  } catch {
    // Stockage plein ou désactivé (navigation privée) : l'app continue sans persistance.
  }
}

export function createStore({ initialState, persist }) {
  const listeners = new Set()
  const { key, version = 1, validate = () => true } = persist ?? {}
  let state = (persist && readStorage(key, version, validate)) ?? initialState()

  const notify = () => listeners.forEach((listener) => listener())

  const store = {
    getState: () => state,
    setState(updater) {
      state = typeof updater === 'function' ? updater(state) : updater
      if (persist) writeStorage(key, version, state)
      notify()
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    reset() {
      store.setState(initialState())
    },
  }

  // Un autre onglet a modifié la même clé : on recharge l'état pour rester synchronisé.
  if (persist && typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
      if (event.key !== key) return
      state = readStorage(key, version, validate) ?? initialState()
      notify()
    })
  }

  return store
}
