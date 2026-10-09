import { DEMO_LABEL } from '../../app/brand'

export function DemoBanner() {
  return (
    <p className="bg-espresso px-4 py-2 text-center text-xs leading-relaxed text-ivory">
      <strong className="font-semibold">{DEMO_LABEL}</strong>
      <span className="hidden sm:inline">
        {' '}
        · Marque, produits et données fictifs. Aucune vente, aucun paiement réel.
      </span>
    </p>
  )
}
