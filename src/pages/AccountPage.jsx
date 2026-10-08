import { PageHeader } from '../components/layout/PageHeader'
import { ComingSoon } from '../components/ui/ComingSoon'

export function AccountPage() {
  return (
    <>
      <PageHeader
        eyebrow="Espace cliente"
        title="Mon espace"
        description="Vos rendez-vous, vos commandes et votre profil."
      />
      <ComingSoon step={7}>
        Connexion simulée, rendez-vous à venir et passés, annulation et historique des commandes.
      </ComingSoon>
    </>
  )
}
