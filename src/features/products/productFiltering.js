// Logique pure de la boutique : recherche, filtres, tri et produits similaires.
import { normalizeText } from '../../lib/text'

export const PRICE_RANGES = [
  { id: 'all', label: 'Tous les prix' },
  { id: 'under-300', label: 'Moins de 300 €', max: 30000 },
  { id: '300-1000', label: 'De 300 à 1 000 €', min: 30000, max: 100000 },
  { id: 'over-1000', label: 'Plus de 1 000 €', min: 100000 },
]

export const SORT_OPTIONS = [
  { id: 'featured', label: 'Sélection' },
  { id: 'price-asc', label: 'Prix croissant' },
  { id: 'price-desc', label: 'Prix décroissant' },
  { id: 'name', label: 'Nom (A à Z)' },
]

export const DEFAULT_FILTERS = { query: '', category: 'all', price: 'all', sort: 'featured' }

// Les filtres vivent dans l'URL (?category=eclairage&sort=price-asc) : une recherche
// peut être partagée ou retrouvée avec le bouton « Précédent » du navigateur.
export function readFilters(searchParams) {
  const pick = (key, allowed) => {
    const value = searchParams.get(key)
    return allowed.includes(value) ? value : DEFAULT_FILTERS[key]
  }
  return {
    query: searchParams.get('q') ?? '',
    category: pick('category', ['all', 'mobilier', 'eclairage', 'decoration', 'bureau', 'exterieur']),
    price: pick('price', PRICE_RANGES.map((range) => range.id)),
    sort: pick('sort', SORT_OPTIONS.map((option) => option.id)),
  }
}

function searchableText(product) {
  return normalizeText(
    [product.name, product.shortDescription, product.style, product.type, ...product.tags, ...product.rooms].join(' '),
  )
}

const sorters = {
  featured: (a, b) => Number(b.featured) - Number(a.featured),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name, 'fr'),
}

export function filterProducts(products, { query, category, price, sort }) {
  const words = normalizeText(query).split(' ').filter(Boolean)
  const range = PRICE_RANGES.find((item) => item.id === price) ?? PRICE_RANGES[0]

  return products
    .filter((product) => category === 'all' || product.category === category)
    .filter((product) => (range.min ?? 0) <= product.price && product.price < (range.max ?? Infinity))
    .filter((product) => {
      if (words.length === 0) return true
      const text = searchableText(product)
      return words.every((word) => text.includes(word))
    })
    .sort(sorters[sort] ?? sorters.featured)
}

export function getSimilarProducts(product, products, limit = 4) {
  return products
    .filter((candidate) => candidate.id !== product.id)
    .map((candidate) => {
      let score = 0
      if (candidate.category === product.category) score += 2
      if (candidate.style === product.style) score += 2
      score += candidate.rooms.filter((room) => product.rooms.includes(room)).length
      score += candidate.tags.filter((tag) => product.tags.includes(tag)).length * 0.5
      return { candidate, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ candidate }) => candidate)
}
