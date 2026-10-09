import assert from 'node:assert/strict'
import { test } from 'node:test'
import { addItem, computeTotals, countItems, getCartLines, removeItem, updateQuantity } from '../src/features/cart/cartLogic.js'

const products = [
  { id: 'a', price: 10000 },
  { id: 'b', price: 150000 },
]

test('ajout : cumule les quantités et plafonne à 10', () => {
  let items = addItem([], 'a')
  items = addItem(items, 'a', 2)
  items = addItem(items, 'b')
  assert.deepEqual(items, [
    { productId: 'a', quantity: 3 },
    { productId: 'b', quantity: 1 },
  ])
  assert.equal(addItem(items, 'a', 50)[0].quantity, 10)
})

test('quantité : 0 supprime, valeur invalide ignorée, décimale arrondie', () => {
  const items = [{ productId: 'a', quantity: 3 }, { productId: 'b', quantity: 1 }]
  assert.equal(updateQuantity(items, 'a', 0).length, 1)
  assert.equal(updateQuantity(items, 'a', Number.NaN), items)
  assert.equal(updateQuantity(items, 'a', 2.6)[0].quantity, 3)
  assert.equal(removeItem(items, 'b').length, 1)
  assert.equal(countItems(items), 4)
})

test('totaux : produit inconnu ignoré, livraison offerte au-delà du seuil', () => {
  const lines = getCartLines([{ productId: 'a', quantity: 3 }, { productId: 'b', quantity: 1 }, { productId: 'supprimé', quantity: 1 }], products)
  assert.equal(lines.length, 2)
  assert.deepEqual(computeTotals(lines), { subtotal: 180000, shipping: 0, total: 180000 })
  assert.deepEqual(computeTotals(getCartLines([{ productId: 'a', quantity: 1 }], products)), { subtotal: 10000, shipping: 4900, total: 14900 })
  assert.deepEqual(computeTotals([]), { subtotal: 0, shipping: 0, total: 0 })
})
