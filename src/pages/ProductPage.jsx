import { useParams } from 'react-router'
import { ROUTES } from '../app/routes'
import { PageHeader } from '../components/layout/PageHeader'
import { ButtonLink } from '../components/ui/Button'
import { ComingSoon } from '../components/ui/ComingSoon'

export function ProductPage() {
  // Le « slug » est l'identifiant lisible du produit dans l'URL : /boutique/serum-eclat
  const { slug } = useParams()

  return (
    <>
      <PageHeader eyebrow="Fiche produit" title={slug}>
        <ButtonLink to={ROUTES.shop} variant="ghost" className="mt-6 px-0">
          ← Retour à la boutique
        </ButtonLink>
      </PageHeader>
      <ComingSoon step={3}>
        Détail du produit : visuels, ingrédients clés, types de peau conseillés et ajout au panier.
      </ComingSoon>
    </>
  )
}
