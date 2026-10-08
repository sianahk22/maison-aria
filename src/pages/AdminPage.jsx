import { PageHeader } from '../components/layout/PageHeader'
import { ComingSoon } from '../components/ui/ComingSoon'

export function AdminPage() {
  return (
    <>
      <PageHeader
        eyebrow="Administration"
        title="Tableau de bord"
        description="Vue d'ensemble de l'activité du studio (données fictives)."
      />
      <ComingSoon step={9}>
        Indicateurs calculés à partir des données de démonstration : réservations, taux d'occupation, ventes et stocks.
      </ComingSoon>
    </>
  )
}
