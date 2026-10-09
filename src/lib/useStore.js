import { useSyncExternalStore } from 'react'

// Abonne un composant à un store : il se réaffiche à chaque changement d'état.
export function useStore(store) {
  return useSyncExternalStore(store.subscribe, store.getState)
}
