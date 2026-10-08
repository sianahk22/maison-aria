import { PageHeader } from '../components/layout/PageHeader'
import { ComingSoon } from '../components/ui/ComingSoon'

export function ConciergePage() {
  return (
    <>
      <PageHeader
        eyebrow="Assistant"
        title="AURA Concierge"
        description="Décrivez votre peau et vos envies : l'assistant vous oriente vers les soins du catalogue."
      />
      <ComingSoon step={8}>
        Assistant simulé : les recommandations sont calculées par des règles à partir du catalogue, sans appel à une vraie IA. Elles ne constituent pas un avis médical.
      </ComingSoon>
    </>
  )
}
