import { Link } from 'react-router'
import { ROUTES } from '../../app/routes'
import { ButtonLink } from '../../components/ui/Button'
import { SmartImage } from '../../components/ui/SmartImage'
import { CATEGORIES } from '../../data/products'
import { formatPrice } from '../../lib/format'
import { AddToCartButton } from '../cart/AddToCartButton'
import { AvailabilityBadge } from './AvailabilityBadge'

const categoryLabel = (id) => CATEGORIES.find((category) => category.id === id)?.label

export function ProductCard({ product, headingLevel = 'h3' }) {
  const Heading = headingLevel

  return (
    <article className="group flex h-full flex-col">
      {/* Image cliquable pour la souris ; ignorée au clavier (le bouton « Voir le produit » suffit). */}
      <Link
        to={ROUTES.product(product.id)}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block overflow-hidden rounded-3xl"
      >
        <div className="aspect-[4/5] transition duration-500 group-hover:scale-[1.03]">
          <SmartImage image={product.image} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
        </div>
        {product.availability !== 'in_stock' && (
          <AvailabilityBadge availability={product.availability} className="absolute top-4 left-4" />
        )}
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        <p className="text-xs tracking-[0.2em] text-stone-deep uppercase">{categoryLabel(product.category)}</p>
        <div className="mt-1 flex items-start justify-between gap-4">
          <Heading className="font-serif text-xl leading-snug">{product.name}</Heading>
          <p className="shrink-0 pt-0.5 font-medium">{formatPrice(product.price)}</p>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-stone-deep">{product.shortDescription}</p>

        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <ButtonLink to={ROUTES.product(product.id)} variant="secondary" size="sm">
            Voir le produit<span className="sr-only"> : {product.name}</span>
          </ButtonLink>
          <AddToCartButton product={product} size="sm" />
        </div>
      </div>
    </article>
  )
}
