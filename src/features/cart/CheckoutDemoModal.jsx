import { ROUTES } from '../../app/routes'
import { Button, ButtonLink } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import { Modal } from '../../components/ui/Modal'
import { formatPrice } from '../../lib/format'

// Écran de commande de démonstration : il s'arrête volontairement avant tout paiement.
// Pour un vrai paiement, on appellerait ici un service (ex. paymentService.createCheckout)
// exécuté côté serveur — jamais de clé secrète dans le navigateur.
export function CheckoutDemoModal({ open, onClose, totals, itemCount }) {
  return (
    <Modal open={open} onClose={onClose} title="Commande de démonstration">
      <div className="flex gap-3 rounded-2xl bg-gold/20 p-4 text-sm leading-relaxed">
        <Icon name="alert" className="mt-0.5 h-5 w-5 shrink-0" />
        <p>
          <strong>Le paiement n’est pas connecté dans cette démonstration.</strong> Aucune commande ne
          sera passée et aucun montant ne sera débité.
        </p>
      </div>

      <dl className="mt-6 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-stone-deep">Articles</dt>
          <dd>{itemCount}</dd>
        </div>
        <div className="flex justify-between border-t border-ink/10 pt-2 text-base font-medium">
          <dt>Total qui aurait été réglé</dt>
          <dd>{formatPrice(totals.total)}</dd>
        </div>
      </dl>

      <p className="mt-6 text-sm leading-relaxed text-stone-deep">
        Dans une version réelle, cette étape redirigerait vers un prestataire de paiement sécurisé.
        Vous pouvez poursuivre la visite ou réserver une consultation pour finaliser votre projet.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button onClick={onClose} className="sm:flex-1">
          Retour au panier
        </Button>
        <ButtonLink to={ROUTES.booking} variant="secondary" className="sm:flex-1">
          Prendre rendez-vous
        </ButtonLink>
      </div>
    </Modal>
  )
}
