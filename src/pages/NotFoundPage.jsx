import { ROUTES } from '../app/routes'
import { PageHeader } from '../components/layout/PageHeader'
import { ButtonLink } from '../components/ui/Button'

export function NotFoundPage() {
  return (
    <PageHeader
      eyebrow="Erreur 404"
      title="Page introuvable"
      description="Cette page n'existe pas ou a été déplacée."
    >
      <ButtonLink to={ROUTES.home} className="mt-8">
        Retour à l'accueil
      </ButtonLink>
    </PageHeader>
  )
}
