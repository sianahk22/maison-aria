// Logique pure du panier : aucune dépendance à React ni au stockage, donc facile à tester.
// Le panier ne stocke que { productId, quantity } : le prix est toujours relu dans le catalogue.

export const MAX_QUANTITY = 10
export const FREE_SHIPPING_THRESHOLD = 150000 // 1 500 € en centimes (valeur fictive)
const SHIPPING_FEE = 4900 // 49 € (valeur fictive)

const clamp = (quantity) => Math.min(MAX_QUANTITY, Math.max(1, Math.round(quantity)))

export function addItem(items, productId, quantity = 1) {
  const existing = items.find((item) => item.productId === productId)
  if (!existing) return [...items, { productId, quantity: clamp(quantity) }]
  return items.map((item) =>
    item.productId === productId ? { ...item, quantity: clamp(item.quantity + quantity) } : item,
  )
}

export function removeItem(items, productId) {
  return items.filter((item) => item.productId !== productId)
}

export function updateQuantity(items, productId, quantity) {
  if (!Number.isFinite(quantity)) return items
  if (quantity <= 0) return removeItem(items, productId)
  return items.map((item) => (item.productId === productId ? { ...item, quantity: clamp(quantity) } : item))
}

export function countItems(items) {
  return items.reduce((total, item) => total + item.quantity, 0)
}

// Associe chaque ligne à son produit. Une ligne dont le produit n'existe plus est ignorée.
export function getCartLines(items, products) {
  const byId = new Map(products.map((product) => [product.id, product]))
  return items
    .filter((item) => byId.has(item.productId))
    .map((item) => {
      const product = byId.get(item.productId)
      return { ...item, product, lineTotal: product.price * item.quantity }
    })
}

export function computeTotals(lines) {
  const subtotal = lines.reduce((total, line) => total + line.lineTotal, 0)
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  return { subtotal, shipping, total: subtotal + shipping }
}
