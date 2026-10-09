import assert from 'node:assert/strict'
import { beforeEach, test } from 'node:test'
import { checkRateLimit, handleConciergeRequest, parseRequestBody, resetRateLimit } from '../server/ariaConcierge.js'

const env = { ANTHROPIC_API_KEY: 'cle-de-test-factice' }
const body = (data) => JSON.stringify(data)

// Faux client : imite la forme de réponse de client.beta.messages.create, sans appel réseau.
function fakeClient(payloadOrError, { stopReason = 'end_turn' } = {}) {
  const calls = []
  return {
    calls,
    beta: {
      messages: {
        async create(params) {
          calls.push(params)
          if (payloadOrError instanceof Error) throw payloadOrError
          return { stop_reason: stopReason, content: [{ type: 'text', text: JSON.stringify(payloadOrError) }] }
        },
      },
    },
  }
}

beforeEach(() => resetRateLimit())

test('sans clé configurée → 503, aucun appel au modèle', async () => {
  const client = fakeClient({})
  const result = await handleConciergeRequest({ rawBody: body({ message: 'canapé' }), ip: '1', env: {}, client })
  assert.equal(result.status, 503)
  assert.equal(result.body.mode, 'simulated')
  assert.equal(client.calls.length, 0)
})

test('validation : message vide, trop long, JSON invalide, corps trop gros', () => {
  assert.ok(parseRequestBody(body({ message: '   ' })).error)
  assert.ok(parseRequestBody(body({ message: 'x'.repeat(501) })).error)
  assert.ok(parseRequestBody('{pas du json').error)
  assert.ok(parseRequestBody('x'.repeat(5000)).error)
  assert.deepEqual(parseRequestBody(body({ message: ' lampe ', contextProductId: 'inconnu' })), { message: 'lampe', contextProductId: undefined })
})

test('limite de débit : 6 demandes par minute et par adresse', () => {
  for (let i = 0; i < 6; i++) assert.ok(checkRateLimit('ip-a', 1000 + i))
  assert.equal(checkRateLimit('ip-a', 2000), false)
  assert.ok(checkRateLimit('ip-b', 2000), 'une autre adresse n’est pas bloquée')
  assert.ok(checkRateLimit('ip-a', 1000 + 61_000), 'débloqué après une minute')
})

test('réponse valide : schéma JSON imposé, message balisé, garde-fou appliqué', async () => {
  const client = fakeClient({
    intent: 'recommendation',
    message: 'Voici deux pièces adaptées.',
    recommendations: [
      { productId: 'canape-sienne', reason: 'Compact, pour un petit salon' },
      { productId: 'trone-en-or', reason: 'inventé' },
    ],
    suggestBooking: false,
    bookingTypeId: 'decouverte',
  })
  const result = await handleConciergeRequest({ rawBody: body({ message: 'Un canapé pour un petit salon' }), ip: '1', env, client })
  assert.equal(result.status, 200)
  assert.equal(result.body.source, 'ai')
  assert.deepEqual(result.body.recommendations.map((r) => r.productId), ['canape-sienne'], 'produit inventé écarté')

  const params = client.calls[0]
  assert.equal(params.model, 'claude-opus-5-5')
  assert.equal(params.output_config.format.type, 'json_schema')
  assert.ok(params.output_config.format.schema.properties.recommendations.items.properties.productId.enum.includes('canape-lune'))
  assert.match(params.messages[0].content, /^<demande_client>Un canapé pour un petit salon<\/demande_client>/)
  assert.ok(params.system[0].text.includes('FICTIVE'))
  assert.deepEqual(params.fallbacks, 'default')
})

test('modèle personnalisé sans repli serveur ; produit consulté jamais recommandé', async () => {
  const client = fakeClient({ intent: 'recommendation', message: 'ok', recommendations: [{ productId: 'canape-lune', reason: 'x' }, { productId: 'vase-dune', reason: 'y' }], suggestBooking: false, bookingTypeId: 'decouverte' })
  const result = await handleConciergeRequest({ rawBody: body({ message: 'accompagner', contextProductId: 'canape-lune' }), ip: '1', env: { ...env, ARIA_AI_MODEL: 'claude-haiku-5-5' }, client })
  assert.equal(client.calls[0].model, 'claude-haiku-5-5')
  assert.equal(client.calls[0].fallbacks, undefined)
  assert.deepEqual(result.body.recommendations.map((r) => r.productId), ['vase-dune'])
})

test('refus du modèle ou erreur réseau → 502 générique, sans fuite de détails', async () => {
  const refused = await handleConciergeRequest({ rawBody: body({ message: 'x' }), ip: '1', env, client: fakeClient({}, { stopReason: 'refusal' }) })
  assert.equal(refused.status, 502)
  const failed = await handleConciergeRequest({ rawBody: body({ message: 'x' }), ip: '2', env, client: fakeClient(new Error('détail interne secret')) })
  assert.equal(failed.status, 502)
  assert.ok(!JSON.stringify(failed.body).includes('secret'))
})
