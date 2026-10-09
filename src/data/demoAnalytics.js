// ─────────────────────────────────────────────────────────────────────────────
// STATISTIQUES FICTIVES du tableau de bord. Elles ne reflètent aucune activité réelle.
// Les actions faites dans ce navigateur (fiches vues, demandes à ARIA) s'y ajoutent.
// ─────────────────────────────────────────────────────────────────────────────

export const DEMO_PRODUCT_VIEWS = {
  'canape-lune': 182,
  'canape-sienne': 164,
  'suspension-halo': 131,
  'bureau-nordique': 118,
  'fauteuil-soleil': 97,
  'miroirs-rotin': 76,
  'table-calanque': 54,
  'vase-dune': 49,
}

export const DEMO_CONCIERGE_REQUESTS = [
  { id: 'demo-q1', text: 'Un canapé pour un salon de 15 m²', intent: 'recommendation', resultCount: 3, hoursAgo: 3 },
  { id: 'demo-q2', text: 'Quelle lampe pour lire le soir ?', intent: 'recommendation', resultCount: 3, hoursAgo: 7 },
  { id: 'demo-q3', text: 'Je souhaite parler à un conseiller', intent: 'advisor', resultCount: 0, hoursAgo: 20 },
  { id: 'demo-q4', text: 'Bureau compact pour le télétravail', intent: 'recommendation', resultCount: 3, hoursAgo: 26 },
  { id: 'demo-q5', text: 'Table de jardin pour 8 personnes à moins de 500 €', intent: 'no_match', resultCount: 0, hoursAgo: 49 },
]

export const DEMO_AVERAGE_CART = 124000 // 1 240 € — valeur fictive

// Commandes FICTIVES affichées au tableau de bord (aucune vente réelle).
export const DEMO_RECENT_ORDERS = [
  { id: 'CMD-DEMO-1108', customer: 'Client fictif B.', daysAgo: 0, status: 'preparing', lines: [{ productId: 'canape-sienne', quantity: 1 }, { productId: 'suspension-halo', quantity: 1 }] },
  { id: 'CMD-DEMO-1107', customer: 'Client fictif E.', daysAgo: 1, status: 'preparing', lines: [{ productId: 'vase-dune', quantity: 2 }] },
  { id: 'CMD-DEMO-1105', customer: 'Client fictif A.', daysAgo: 2, status: 'shipped', lines: [{ productId: 'bureau-nordique', quantity: 1 }, { productId: 'chaise-atelier', quantity: 1 }] },
  { id: 'CMD-DEMO-1102', customer: 'Client fictif D.', daysAgo: 4, status: 'delivered', lines: [{ productId: 'chaises-pop', quantity: 2 }] },
  { id: 'CMD-DEMO-1098', customer: 'Client fictif C.', daysAgo: 6, status: 'delivered', lines: [{ productId: 'canape-lune', quantity: 1 }] },
]
