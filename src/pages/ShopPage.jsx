import { PageHeader } from '../components/layout/PageHeader'
import { ComingSoon } from '../components/ui/ComingSoon'

export function ShopPage() {
  return (
    <>
      <PageHeader
        eyebrow="Boutique"
        title="Les soins AURA"
        description="Sérums, crèmes, huiles et rituels pour chaque type de peau."
      />
      <ComingSoon step={3}>
        Catalogue de produits fictifs avec filtres par catégorie, type de peau, préoccupation et prix.
      </ComingSoon>
    </>
  )
}
