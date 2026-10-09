import { useState } from 'react'
import { ROUTES } from '../app/routes'
import { PageHeader } from '../components/layout/PageHeader'
import { Button, ButtonLink } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Icon } from '../components/ui/Icon'
import { CartLine } from '../features/cart/CartLine'
import { CheckoutDemoModal } from '../features/cart/CheckoutDemoModal'
import { FREE_SHIPPING_THRESHOLD, computeTotals, countItems, getCartLines } from '../features/cart/cartLogic'
import { cartStore } from '../features/cart/cartStore'
import { useProducts } from '../features/products/useProducts'
import { formatPrice, pluralize } from '../lib/format'
import { useStore } from '../lib/useStore'

export function CartPage() {
  const products = useProducts()
  const { items } = useStore(cartStore)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const lines = getCartLines(items, products)
  const totals = computeTotals(lines)
  const itemCount = countItems(lines)

  if (lines.length === 0) {
    return (
      <>
        <PageHeader eyebrow="Panier" title="Votre panier est vide" />
        <Container>
          <div className="rounded-3xl bg-white px-6 py-16 text-center">
            <Icon name="bag" className="mx-auto h-10 w-10 text-stone" />
            <p className="mx-auto mt-4 max-w-md text-stone-deep">
              Parcourez la collection ou demandez conseil à ARIA Concierge pour trouver les pièces
              qui vous ressemblent.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink to={ROUTES.shop}>Découvrir la collection</ButtonLink>
              <ButtonLink to={ROUTES.concierge} variant="secondary">
                Parler à l’assistant
              </ButtonLink>
            </div>
          </div>
        </Container>
      </>
    )
  }

  return (
    <>
      <PageHeader eyebrow="Panier" title="Votre panier" description={pluralize(itemCount, 'article')} />

      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16">
        <ul className="divide-y divide-ink/10 border-y border-ink/10">
          {lines.map((line) => (
            <CartLine key={line.productId} line={line} />
          ))}
        </ul>

        <aside aria-labelledby="summary-title" className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl bg-white p-6 sm:p-8">
            <h2 id="summary-title" className="font-serif text-2xl">
              Récapitulatif
            </h2>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-stone-deep">Sous-total</dt>
                <dd>{formatPrice(totals.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-deep">Livraison estimée</dt>
                <dd>{totals.shipping === 0 ? 'Offerte' : formatPrice(totals.shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-ink/10 pt-3 text-lg font-medium">
                <dt>Total</dt>
                <dd>{formatPrice(totals.total)}</dd>
              </div>
            </dl>
            {totals.shipping > 0 && (
              <p className="mt-3 text-xs text-stone-deep">
                Livraison offerte dès {formatPrice(FREE_SHIPPING_THRESHOLD)} (conditions fictives).
              </p>
            )}

            <div className="mt-8 flex flex-col gap-3">
              <Button size="lg" onClick={() => setCheckoutOpen(true)}>
                Passer à la commande
              </Button>
              <ButtonLink to={ROUTES.shop} variant="secondary" size="lg">
                Continuer mes achats
              </ButtonLink>
            </div>
            <p className="mt-4 text-center text-xs text-stone-deep">
              Panier enregistré dans ce navigateur. Paiement non connecté (démonstration).
            </p>
          </div>
        </aside>
      </Container>

      <CheckoutDemoModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        totals={totals}
        itemCount={itemCount}
      />
    </>
  )
}
