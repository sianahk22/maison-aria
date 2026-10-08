import { useRouteError } from 'react-router'
import { ROUTES } from '../app/routes'
import { DemoBanner } from '../components/layout/DemoBanner'
import { PageHeader } from '../components/layout/PageHeader'

// Affichée si une erreur inattendue survient pendant l'affichage d'une page,
// au lieu d'un écran blanc. Le détail technique ne va que dans la console.
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
          <a
            href={ROUTES.home}
            className="mt-8 inline-flex rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-ivory hover:bg-terracotta-deep"
          >
            Retour à l'accueil
          </a>
        </PageHeader>
      </main>
    </>
  )
}
