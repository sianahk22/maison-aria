// ─────────────────────────────────────────────────────────────────────────────
// PROFIL ET HISTORIQUE FICTIFS de l'espace client de démonstration.
// Aucune authentification réelle : tout visiteur voit ce même profil fictif.
// ─────────────────────────────────────────────────────────────────────────────

export const DEMO_PROFILE = {
  name: 'Client démo',
  email: 'client.demo@exemple.fr',
  city: 'Lyon (fictif)',
  memberSince: 'mars 2025',
  preferences: {
    styles: ['scandinave', 'naturel'],
    rooms: ['salon', 'bureau'],
    budget: '1 000 à 3 000 € (fictif)',
  },
  // Texte utilisé pour calculer des recommandations avec le moteur d'ARIA.
  recommendationQuery: 'style scandinave naturel bois pour le salon',
}

export const DEMO_ORDERS = [
  {
    id: 'CMD-DEMO-1042',
    date: '2026-06-14',
    status: 'Livrée (fictif)',
    lines: [
      { productId: 'bureau-nordique', quantity: 1 },
      { productId: 'chaise-atelier', quantity: 1 },
    ],
  },
  {
    id: 'CMD-DEMO-0987',
    date: '2026-02-03',
    status: 'Livrée (fictif)',
    lines: [
      { productId: 'vase-dune', quantity: 2 },
      { productId: 'miroirs-rotin', quantity: 1 },
    ],
  },
]
