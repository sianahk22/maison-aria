import { PageHeader } from '../components/layout/PageHeader'
import { ComingSoon } from '../components/ui/ComingSoon'

export function CartPage() {
  return (
    <>
      <PageHeader
        eyebrow="Panier"
        title="Votre panier"
        description="Retrouvez ici les soins sélectionnés."
      />
      <ComingSoon step={4}>
        Panier enregistré dans le navigateur, calcul des totaux et commande simulée, sans paiement réel.
      </ComingSoon>
    </>
  )
}
