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
