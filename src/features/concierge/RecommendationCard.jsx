import { Link } from 'react-router'
import { ROUTES } from '../../app/routes'
import { ButtonLink } from '../../components/ui/Button'
import { SmartImage } from '../../components/ui/SmartImage'
import { formatPrice } from '../../lib/format'

export function RecommendationCard({ product, reason }) {
  return (
    <article className="flex gap-3 rounded-2xl border border-ink/10 bg-ivory p-3">
      <Link to={ROUTES.product(product.id)} tabIndex={-1} aria-hidden="true" className="w-20 shrink-0 overflow-hidden rounded-xl">
        <div className="aspect-[4/5]">
          <SmartImage image={product.image} sizes="80px" />
        </div>
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-serif text-lg leading-snug">{product.name}</h3>
          <p className="shrink-0 text-sm">{formatPrice(product.price)}</p>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-stone-deep">
          <span className="sr-only">Pourquoi : </span>
          {reason}
        </p>
        <ButtonLink to={ROUTES.product(product.id)} variant="secondary" size="sm" className="mt-auto self-start">
          Voir le produit<span className="sr-only"> : {product.name}</span>
        </ButtonLink>
      </div>
    </article>
  )
}
