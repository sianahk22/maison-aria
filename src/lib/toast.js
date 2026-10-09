import { createStore } from './createStore'

// Notifications éphémères (« Ajouté au panier »…). Non persistées.
export const toastStore = createStore({ initialState: () => [] })

let nextId = 1

export function showToast({ message, action }) {
  const id = nextId++
  toastStore.setState((toasts) => [...toasts.slice(-2), { id, message, action }])
  setTimeout(() => dismissToast(id), 4000)
}

export function dismissToast(id) {
  toastStore.setState((toasts) => toasts.filter((toast) => toast.id !== id))
}
