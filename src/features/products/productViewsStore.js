import { createStore } from '../../lib/createStore'

// Compte local des fiches consultées dans CE navigateur (alimente le tableau de bord de démo).
export const productViewsStore = createStore({
  initialState: () => ({}),
  persist: {
    key: 'aura-studio:product-views',
    version: 1,
    validate: (state) => typeof state === 'object' && state !== null && !Array.isArray(state),
  },
})

export function recordProductView(productId) {
  productViewsStore.setState((views) => ({ ...views, [productId]: (views[productId] ?? 0) + 1 }))
}
