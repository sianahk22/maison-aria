import { useSearchParams } from 'react-router'
import { PageHeader } from '../components/layout/PageHeader'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { pluralize } from '../lib/format'
import { ProductCard } from '../features/products/ProductCard'
import { ProductFilters } from '../features/products/ProductFilters'
import { DEFAULT_FILTERS, filterProducts, readFilters } from '../features/products/productFiltering'
import { useProducts } from '../features/products/useProducts'

const PARAM_NAMES = { query: 'q', category: 'category', price: 'price', sort: 'sort' }

export function ShopPage() {
  const products = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = readFilters(searchParams)
  const results = filterProducts(products, filters)

  function updateFilters(changes) {
    const next = new URLSearchParams(searchParams)
    for (const [key, value] of Object.entries(changes)) {
      const param = PARAM_NAMES[key]
      if (value === DEFAULT_FILTERS[key]) next.delete(param)
      else next.set(param, value)
    }
    // `replace` : taper une recherche ne remplit pas l'historique du navigateur.
    setSearchParams(next, { replace: true, preventScrollReset: true })
  }

  return (
    <>
      <PageHeader
        eyebrow="Collection"
        title="La collection"
        description="Mobilier, luminaires et objets choisis pour durer. Tous les produits présentés sont fictifs."
      />

      <Container>
        <ProductFilters filters={filters} onChange={updateFilters} />

        <p role="status" className="mt-8 text-sm text-stone-deep">
          {pluralize(results.length, 'produit')} sur {products.length}
        </p>

        {results.length > 0 ? (
          <ul className="mt-6 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} headingLevel="h2" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-ink/20 px-6 py-16 text-center">
            <h2 className="font-serif text-2xl">Aucun produit ne correspond</h2>
            <p className="mx-auto mt-2 max-w-md text-stone-deep">
              Essayez un autre mot-clé ou élargissez la catégorie et le budget.
            </p>
            <Button variant="secondary" className="mt-6" onClick={() => setSearchParams({}, { replace: true })}>
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </Container>
    </>
  )
}
