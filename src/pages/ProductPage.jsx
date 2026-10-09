import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { pageTitle } from '../app/brand'
import { ROUTES } from '../app/routes'
import { ButtonLink } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Icon } from '../components/ui/Icon'
import { QuantityInput } from '../components/ui/QuantityInput'
import { CATEGORIES, STYLES } from '../data/products'
import { AddToCartButton } from '../features/cart/AddToCartButton'
import { AvailabilityBadge } from '../features/products/AvailabilityBadge'
import { ProductCard } from '../features/products/ProductCard'
import { ProductGallery } from '../features/products/ProductGallery'
import { getSimilarProducts } from '../features/products/productFiltering'
import { recordProductView } from '../features/products/productViewsStore'
import { useProducts } from '../features/products/useProducts'
import { formatDimensions, formatPrice } from '../lib/format'
import { NotFoundPage } from './NotFoundPage'

export function ProductPage() {
  const { productId } = useParams()
  const products = useProducts()
  const product = products.find((item) => item.id === productId)

  useEffect(() => {
    if (product) recordProductView(product.id)
  }, [product])

  if (!product) {
    return (
      <NotFoundPage
        title="Produit introuvable"
        description="Ce produit n'existe pas ou ne fait plus partie de la collection de démonstration."
      />
    )
  }

  // `key` : la quantité repart à 1 quand on passe d'un produit à un autre.
  return <ProductDetails key={product.id} product={product} products={products} />
}

function ProductDetails({ product, products }) {
  const [quantity, setQuantity] = useState(1)
  const category = CATEGORIES.find((item) => item.id === product.category)
  const similar = getSimilarProducts(product, products)

  const specs = [
    ['Dimensions', formatDimensions(product.dimensions)],
    ['Matériaux', product.materials.join(' · ')],
    ['Style', STYLES[product.style]],
    ['Délai indicatif', `${product.leadTime} — donnée de démonstration`],
  ]

  return (
    <>
      <title>{pageTitle(product.name)}</title>
      <Container className="pt-6 sm:pt-10">
        <nav aria-label="Fil d'Ariane" className="text-sm text-stone-deep">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to={ROUTES.shop} className="hover:text-ink hover:underline">
                Collection
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to={`${ROUTES.shop}?category=${product.category}`} className="hover:text-ink hover:underline">
                {category.label}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery product={product} />

          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs tracking-[0.25em] text-terracotta-deep uppercase">{category.label}</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">{product.name}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <p className="text-2xl">{formatPrice(product.price)}</p>
              <AvailabilityBadge availability={product.availability} />
            </div>
            <p className="mt-6 text-lg leading-relaxed text-stone-deep">{product.description}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {product.availability !== 'out_of_stock' && (
                <QuantityInput
                  id="product-quantity"
                  label="Quantité"
                  value={quantity}
                  onChange={setQuantity}
                />
              )}
              <AddToCartButton product={product} quantity={quantity} size="lg" className="flex-1 sm:flex-none" />
            </div>
            <p className="mt-3 text-xs text-stone-deep">
              Démonstration : aucune commande réelle ne sera passée.
            </p>

            <dl className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
              {specs.map(([label, value]) => (
                <div key={label} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr]">
                  <dt className="text-sm font-medium">{label}</dt>
                  <dd className="text-sm text-stone-deep">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 rounded-3xl bg-sand p-6">
              <p className="font-serif text-xl">Un doute sur les dimensions ou l’harmonie ?</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <ButtonLink to={`${ROUTES.concierge}?product=${product.id}`} variant="secondary" size="sm">
                  <Icon name="sparkle" className="h-4 w-4" />
                  Demander conseil à l’assistant
                </ButtonLink>
                <ButtonLink to={ROUTES.booking} variant="ghost" size="sm">
                  Prendre rendez-vous
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {similar.length > 0 && (
        <section aria-labelledby="similar-title" className="mt-24">
          <Container>
            <h2 id="similar-title" className="font-serif text-3xl">
              Vous aimerez aussi
            </h2>
            <ul className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {similar.map((item) => (
                <li key={item.id}>
                  <ProductCard product={item} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </>
  )
}
