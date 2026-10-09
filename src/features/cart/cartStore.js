import { createStore } from '../../lib/createStore'
import { addItem, removeItem, updateQuantity } from './cartLogic'

const isValidCart = (state) =>
  Array.isArray(state?.items) &&
  state.items.every(
    (item) => typeof item.productId === 'string' && Number.isInteger(item.quantity) && item.quantity > 0,
  )

export const cartStore = createStore({
  initialState: () => ({ items: [] }),
  persist: { key: 'aura-studio:cart', version: 1, validate: isValidCart },
})

export const addToCart = (productId, quantity = 1) =>
  cartStore.setState((state) => ({ items: addItem(state.items, productId, quantity) }))

export const removeFromCart = (productId) =>
  cartStore.setState((state) => ({ items: removeItem(state.items, productId) }))

export const setCartQuantity = (productId, quantity) =>
  cartStore.setState((state) => ({ items: updateQuantity(state.items, productId, quantity) }))
