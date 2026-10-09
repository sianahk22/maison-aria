import { ROUTES } from '../../app/routes'
import { Button } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import { showToast } from '../../lib/toast'
import { addToCart } from './cartStore'

export function AddToCartButton({ product, quantity = 1, size = 'md', variant = 'primary', className = '' }) {
  const unavailable = product.availability === 'out_of_stock'

  function handleClick() {
    addToCart(product.id, quantity)
    showToast({
      message: `${product.name} ajouté au panier`,
      action: { to: ROUTES.cart, label: 'Voir le panier' },
    })
  }

  return (
    <Button variant={variant} size={size} onClick={handleClick} disabled={unavailable} className={className}>
      <Icon name={unavailable ? 'close' : 'plus'} className="h-4 w-4" />
      {unavailable ? 'Indisponible' : 'Ajouter au panier'}
      <span className="sr-only"> : {product.name}</span>
    </Button>
  )
}
