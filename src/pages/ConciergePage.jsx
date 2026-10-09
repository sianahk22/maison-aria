import { use } from 'react'
import { useSearchParams } from 'react-router'
import { PageHeader } from '../components/layout/PageHeader'
import { Container } from '../components/ui/Container'
import { Icon } from '../components/ui/Icon'
import { SmartImage } from '../components/ui/SmartImage'
import { sceneImages } from '../data/images'
import { ConciergeChat } from '../features/concierge/ConciergeChat'
import { useProduct } from '../features/products/useProducts'
import { getAriaMode } from '../services/conciergeService'

const HOW_IT_WORKS = [
  'ARIA analyse votre demande : type de meuble, style, ambiance, pièce, budget.',
  'Elle ne recommande que des pièces existant dans le catalogue de démonstration, en expliquant pourquoi.',
  'Pour un vrai projet, elle vous oriente vers une consultation avec un conseiller.',
]

export function ConciergePage() {
  const [searchParams] = useSearchParams()
  // ?product=<id> : question posée depuis une fiche produit.
  const contextProduct = useProduct(searchParams.get('product'))
  const ariaMode = use(getAriaMode())

  return (
    <>
      <PageHeader
        eyebrow="Assistant"
        title="ARIA Concierge"
        description="Décrivez votre intérieur et vos envies : ARIA vous oriente vers des pièces de la collection."
      />

      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
        <div>
          <p className="mb-4 flex gap-3 rounded-2xl bg-gold/25 p-4 text-sm leading-relaxed">
            <Icon name="alert" className="mt-0.5 h-5 w-5 shrink-0" />
            {ariaMode.mode === 'ai' ? (
              <span>
                <strong>Assistant IA (Claude, Anthropic).</strong> Votre message est envoyé à notre serveur puis
                au modèle pour formuler une réponse ; n’y indiquez pas de données personnelles. Les
                recommandations sont limitées au catalogue fictif et vérifiées par l’application. Ceci n’est
                pas un conseil professionnel.
              </span>
            ) : (
              <span>
                <strong>Assistant simulé.</strong> Les réponses sont calculées localement, par des règles,
                à partir du catalogue fictif. Aucune IA n’est connectée et votre message ne quitte pas
                votre navigateur. Ceci n’est pas un conseil professionnel.
              </span>
            )}
          </p>
          <ConciergeChat key={contextProduct?.id ?? 'general'} contextProduct={contextProduct} />
        </div>

        <aside className="space-y-6">
          <div className="hidden aspect-[4/5] overflow-hidden rounded-3xl lg:block">
            <SmartImage image={sceneImages.concierge} sizes="352px" />
          </div>
          <div className="rounded-3xl bg-white p-6">
            <h2 className="font-serif text-2xl">Comment fonctionne ARIA ?</h2>
            <ol className="mt-4 space-y-3 text-sm leading-relaxed text-stone-deep">
              {HOW_IT_WORKS.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="font-serif text-base text-terracotta-deep">{index + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </Container>
    </>
  )
}
