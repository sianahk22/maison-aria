import { useRouteError } from 'react-router'
import { ROUTES } from '../app/routes'
import { DemoBanner } from '../components/layout/DemoBanner'
import { PageHeader } from '../components/layout/PageHeader'
import { buttonClassesForAnchor } from '../components/ui/buttonStyles'

// Affichée si une erreur inattendue survient, au lieu d'un écran blanc.
// Le détail technique ne va que dans la console, jamais à l'écran.
export function ErrorPage() {
  const error = useRouteError()
  console.error(error)

  return (
    <>
      <DemoBanner />
      <main>
        <PageHeader
          eyebrow="Erreur"
          title="Une erreur est survenue"
          description="Nous n'avons pas pu afficher cette page. Vous pouvez réessayer ou revenir à l'accueil."
        >
          {/* Lien HTML classique : recharge complètement l'application pour repartir d'un état propre. */}
          <a href={ROUTES.home} className={buttonClassesForAnchor}>
            Retour à l'accueil
          </a>
        </PageHeader>
      </main>
    </>
  )
}
