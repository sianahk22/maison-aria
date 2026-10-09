import { useRouteError } from 'react-router'
import { ROUTES } from '../app/routes'
import { PageHeader } from '../components/layout/PageHeader'
import { Button, ButtonLink } from '../components/ui/Button'

// Erreur dans une page : affichée À L'INTÉRIEUR du gabarit, l'en-tête et la navigation restent
// utilisables. Le détail technique ne va que dans la console, jamais à l'écran.
export function RouteErrorPage() {
  const error = useRouteError()
  console.error(error)

  return (
    <PageHeader
      eyebrow="Erreur"
      title="Cette page n’a pas pu s’afficher"
      description="Un problème est survenu pendant le chargement. Vous pouvez réessayer ou poursuivre la visite."
    >
      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={() => window.location.reload()}>Réessayer</Button>
        <ButtonLink to={ROUTES.home} variant="secondary">
          Retour à l’accueil
        </ButtonLink>
      </div>
    </PageHeader>
  )
}
