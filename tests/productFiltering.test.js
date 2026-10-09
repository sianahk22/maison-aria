import assert from 'node:assert/strict'
import { test } from 'node:test'
import { products } from '../src/data/products.js'
import { filterProducts, getSimilarProducts, readFilters } from '../src/features/products/productFiltering.js'

const filters = (overrides) => ({ query: '', category: 'all', price: 'all', sort: 'featured', ...overrides })

test('catalogue : au moins 12 produits complets, identifiants uniques, 5 catégories', () => {
  assert.ok(products.length >= 12)
  assert.equal(new Set(products.map((p) => p.id)).size, products.length)
  assert.equal(new Set(products.map((p) => p.category)).size, 5)
  for (const p of products) {
    for (const field of ['id', 'name', 'description', 'category', 'style', 'availability']) assert.ok(p[field], `${p.id}.${field}`)
    assert.ok(Number.isInteger(p.price) && p.price > 0, `${p.id} prix en centimes`)
    assert.ok(p.image?.alt && p.materials.length && p.tags.length && p.dimensions.width, p.id)
  }
})

test('recherche insensible aux accents et aux majuscules', () => {
  const oak = filterProducts(products, filters({ query: 'CHÊNE' }))
  assert.ok(oak.length > 0 && oak.every((p) => p.materials.some((m) => /chêne/i.test(m))), 'recherche dans les matériaux')
  assert.ok(filterProducts(products, filters({ query: 'eclairage' })).every((p) => p.category === 'eclairage'), 'recherche par catégorie')
  assert.deepEqual(filterProducts(products, filters({ query: 'zzzz' })), [])
})

test('filtres catégorie et prix, tri par prix', () => {
  assert.ok(filterProducts(products, filters({ category: 'eclairage' })).every((p) => p.category === 'eclairage'))
  assert.ok(filterProducts(products, filters({ price: 'under-300' })).every((p) => p.price < 30000))
  const sorted = filterProducts(products, filters({ sort: 'price-asc' })).map((p) => p.price)
  assert.deepEqual(sorted, [...sorted].sort((a, b) => a - b))
})

test('paramètres d’URL invalides ignorés', () => {
  const read = readFilters(new URLSearchParams('category=pirate&sort=hack&price=999&q=lampe'))
  assert.deepEqual(read, { query: 'lampe', category: 'all', price: 'all', sort: 'featured' })
})

test('produits similaires : jamais le produit lui-même', () => {
  const similar = getSimilarProducts(products[0], products)
  assert.ok(similar.length > 0 && similar.length <= 4)
  assert.ok(!similar.some((p) => p.id === products[0].id))
})
