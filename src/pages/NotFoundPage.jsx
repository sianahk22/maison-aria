import { ROUTES } from '../app/routes'
import { PageHeader } from '../components/layout/PageHeader'
import { ButtonLink } from '../components/ui/Button'

export function NotFoundPage({ title = 'Page introuvable', description }) {
  return (
    <PageHeader
      eyebrow="Erreur 404"
      title={title}
      description={description ?? "Cette page n'existe pas ou a été déplacée."}
    >
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink to={ROUTES.home}>Retour à l'accueil</ButtonLink>
        <ButtonLink to={ROUTES.shop} variant="secondary">
          Voir la collection
        </ButtonLink>
      </div>
    </PageHeader>
  )
}
