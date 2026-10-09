import { Link } from 'react-router'
import { ROUTES } from '../../app/routes'
import { Icon } from '../../components/ui/Icon'
import { QuantityInput } from '../../components/ui/QuantityInput'
import { SmartImage } from '../../components/ui/SmartImage'
import { formatPrice } from '../../lib/format'
import { MAX_QUANTITY } from './cartLogic'
import { removeFromCart, setCartQuantity } from './cartStore'

export function CartLine({ line }) {
  const { product, quantity, lineTotal } = line

  return (
    <li className="grid grid-cols-[6rem_1fr] gap-4 py-6 sm:grid-cols-[8rem_1fr] sm:gap-6">
      <Link to={ROUTES.product(product.id)} tabIndex={-1} aria-hidden="true" className="block overflow-hidden rounded-2xl">
        <div className="aspect-[4/5]">
          <SmartImage image={product.image} sizes="128px" />
        </div>
      </Link>

      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
          <div className="min-w-0">
            <h2 className="font-serif text-xl leading-snug">
              <Link to={ROUTES.product(product.id)} className="hover:underline">
                {product.name}
              </Link>
            </h2>
            <p className="text-sm text-stone-deep">{formatPrice(product.price)} l’unité</p>
          </div>
          <p className="font-medium">{formatPrice(lineTotal)}</p>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <QuantityInput
            id={`quantity-${product.id}`}
            label={`Quantité pour ${product.name}`}
            value={quantity}
            max={MAX_QUANTITY}
            onChange={(next) => setCartQuantity(product.id, next)}
          />
          <button
            type="button"
            onClick={() => removeFromCart(product.id)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm text-stone-deep hover:bg-sand hover:text-ink"
          >
            <Icon name="trash" className="h-4 w-4" />
            Supprimer<span className="sr-only"> {product.name} du panier</span>
          </button>
        </div>
      </div>
    </li>
  )
}
