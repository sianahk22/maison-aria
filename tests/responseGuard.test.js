import assert from 'node:assert/strict'
import { test } from 'node:test'
import { products } from '../src/data/products.js'
import { guardConciergeResponse } from '../src/services/aria/responseGuard.js'

test('garde-fou : écarte les produits inventés et limite à 3', () => {
  const raw = {
    intent: 'recommendation',
    message: 'Voici mes idées',
    recommendations: [{ productId: 'trone-en-or', reason: 'inventé' }, ...products.slice(0, 5).map((p) => ({ productId: p.id, reason: 'ok' }))],
  }
  const guarded = guardConciergeResponse(raw, products)
  assert.equal(guarded.recommendations.length, 3)
  assert.ok(!guarded.recommendations.some((r) => r.productId === 'trone-en-or'))
})

test('garde-fou : réponse malformée → réponse prudente, jamais d’exception', () => {
  for (const raw of [null, undefined, 'texte brut', { intent: 'reserver_maintenant', message: 42, recommendations: 'non' }]) {
    const guarded = guardConciergeResponse(raw, products)
    assert.equal(guarded.intent, 'unknown')
    assert.ok(guarded.message.length > 10)
    assert.deepEqual(guarded.recommendations, [])
    assert.equal(guarded.suggestBooking, false)
  }
})

test('garde-fou : textes tronqués et type de consultation validé', () => {
  const guarded = guardConciergeResponse(
    { intent: 'advisor', message: 'x'.repeat(5000), recommendations: [{ productId: products[0].id, reason: 'y'.repeat(999) }], suggestBooking: true, bookingTypeId: 'gratuit-a-vie' },
    products,
  )
  assert.equal(guarded.message.length, 600)
  assert.equal(guarded.recommendations[0].reason.length, 160)
  assert.equal(guarded.bookingTypeId, 'decouverte')
})
