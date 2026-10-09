// ─────────────────────────────────────────────────────────────────────────────
// Moteur de recommandation LOCAL d'ARIA Concierge (aucune IA, aucune donnée envoyée).
//
// 1. normalise la demande (minuscules, sans accents, pluriels simplifiés) ;
// 2. détecte des critères par mots-clés (type, style, ambiance, taille, matière, pièce, budget) ;
// 3. attribue un score à chaque produit du catalogue et garde les meilleurs ;
// 4. explique chaque recommandation par les critères qu'elle remplit.
//
// Il ne peut recommander que des produits reçus en paramètre : impossible d'inventer un produit.
// Une future version « IA » devra renvoyer la même forme de réponse (voir conciergeService).
// ─────────────────────────────────────────────────────────────────────────────
import { normalizeText } from './text'

const includesAny = (values, wanted) => values.some((value) => wanted.includes(value))
const textOf = (product) => normalizeText([...product.materials, ...product.tags].join(' '))

// group : 'type' (nature du produit) ou autre ; weight : importance dans le score.
const CRITERIA = [
  { id: 'canape', group: 'type', label: 'canapé', words: ['canape', 'sofa', 'banquette'], match: (p) => p.type === 'canape' },
  { id: 'fauteuil', group: 'type', label: 'fauteuil', words: ['fauteuil'], match: (p) => p.type === 'fauteuil' },
  { id: 'chaise', group: 'type', label: 'assise', words: ['chaise', 'tabouret', 'assise'], match: (p) => ['chaise', 'tabouret'].includes(p.type) },
  {
    id: 'luminaire',
    group: 'type',
    label: 'luminaire',
    words: ['lampe', 'luminaire', 'lumiere', 'eclairage', 'lampadaire', 'suspension', 'eclairer'],
    match: (p) => p.category === 'eclairage',
  },
  {
    id: 'decoration',
    group: 'type',
    label: 'décoration',
    words: ['deco', 'decoration', 'miroir', 'vase', 'objet', 'etagere', 'rangement'],
    match: (p) => p.category === 'decoration',
  },
  { id: 'bureau', group: 'type', label: 'espace de travail', words: ['bureau', 'teletravail', 'travail', 'travailler'], match: (p) => p.category === 'bureau' },
  { id: 'exterieur', group: 'type', label: 'extérieur', words: ['exterieur', 'terrasse', 'jardin', 'balcon'], match: (p) => p.category === 'exterieur' },
  { id: 'table', group: 'type', label: 'table', words: ['table', 'repa', 'diner'], match: (p) => p.type === 'table' },

  { id: 'minimaliste', weight: 3, label: 'style minimaliste', words: ['minimaliste', 'minimal', 'epure', 'sobre', 'simple'], match: (p) => p.style === 'minimaliste' || p.tags.includes('épuré') },
  { id: 'scandinave', weight: 3, label: 'style scandinave', words: ['scandinave', 'nordique', 'scandi'], match: (p) => p.style === 'scandinave' },
  { id: 'contemporain', weight: 3, label: 'style contemporain', words: ['contemporain', 'moderne'], match: (p) => p.style === 'contemporain' },
  { id: 'naturel', weight: 3, label: 'esprit naturel', words: ['naturel', 'boheme', 'nature', 'organique'], match: (p) => p.style === 'naturel' },
  { id: 'vintage', weight: 3, label: 'esprit vintage', words: ['vintage', 'retro', 'annee'], match: (p) => p.style === 'vintage' },

  {
    id: 'chaleureux',
    weight: 2,
    label: 'ambiance chaleureuse',
    words: ['chaleureux', 'chaleureuse', 'cosy', 'douillet', 'chaud', 'chaude', 'douce', 'doux', 'accueillant'],
    match: (p) => includesAny(p.tags, ['chaleureux', 'lumière douce', 'lumière chaleureuse', 'doux']),
  },
  {
    id: 'compact',
    weight: 2.5,
    label: 'format compact',
    words: ['petit', 'petite', 'compact', 'studio', 'etroit', 'peu de place'],
    match: (p) => includesAny(p.tags, ['compact', 'petit espace']),
  },
  { id: 'grand', weight: 2, label: 'grand format', words: ['grand', 'grande', 'famille', 'spacieux'], match: (p) => p.tags.includes('grand format') },
  { id: 'lecture', weight: 2, label: 'coin lecture', words: ['lecture', 'lire', 'livre'], match: (p) => p.tags.includes('lecture') },
  { id: 'couleur', weight: 1.5, label: 'touche de couleur', words: ['couleur', 'colore', 'vif', 'pop'], match: (p) => p.tags.includes('coloré') },

  { id: 'bois', weight: 1.5, label: 'bois', words: ['bois', 'chene', 'hetre'], match: (p) => /chene|hetre|frene|noyer|bois/.test(textOf(p)) },
  { id: 'velours', weight: 1.5, label: 'velours', words: ['velour'], match: (p) => textOf(p).includes('velours') },
  { id: 'cuir', weight: 1.5, label: 'cuir', words: ['cuir'], match: (p) => textOf(p).includes('cuir') },
  { id: 'rotin', weight: 1.5, label: 'rotin', words: ['rotin', 'osier'], match: (p) => textOf(p).includes('rotin') },
  { id: 'ceramique', weight: 1.5, label: 'céramique', words: ['ceramique', 'gres'], match: (p) => /ceramique|gres/.test(textOf(p)) },

  { id: 'salon', weight: 1, label: 'salon', words: ['salon', 'sejour'], match: (p) => p.rooms.includes('salon') },
  { id: 'chambre', weight: 1, label: 'chambre', words: ['chambre'], match: (p) => p.rooms.includes('chambre') },
  { id: 'cuisine', weight: 1, label: 'cuisine', words: ['cuisine', 'ilot'], match: (p) => p.rooms.includes('cuisine') },
  { id: 'salle-a-manger', weight: 1, label: 'salle à manger', words: ['salle a manger', 'manger'], match: (p) => p.rooms.includes('salle à manger') },
]

const ROOM_LABELS = {
  salon: 'le salon',
  chambre: 'la chambre',
  cuisine: 'la cuisine',
  'salle à manger': 'la salle à manger',
  entrée: 'l’entrée',
  bureau: 'le bureau',
  terrasse: 'la terrasse',
  jardin: 'le jardin',
  'salle de bain': 'la salle de bain',
}

const ADVISOR_WORDS = ['conseiller', 'conseillere', 'rendez vou', 'rdv', 'humain', 'parler a', 'consultation', 'expert', 'architecte', 'decorateur', 'appeler']
const GREETING_WORDS = ['bonjour', 'salut', 'hello', 'bonsoir', 'coucou']
const BUDGET_PATTERN = /(?:moins de|max(?:imum)?|budget(?: de)?|sous|jusqu a|pas plus de)\s*(\d[\d ]*)/

// « Je cherche des lampes » → « je cherche de lampe » : on retire le « s » final des mots
// de plus de 3 lettres pour que singulier et pluriel correspondent.
// La même règle est appliquée aux mots-clés (« bois » → « boi ») pour que les deux côtés correspondent.
const singularize = (text) =>
  normalizeText(text)
    .split(' ')
    .map((word) => (word.length > 3 && word.endsWith('s') ? word.slice(0, -1) : word))
    .join(' ')

const prepare = (message) => ` ${singularize(message)} `

// Le mot-clé doit commencer un mot de la demande : « lampe » trouve « lampes », pas « clampe ».
const mentions = (text, words) => words.some((word) => text.includes(` ${singularize(word)}`))

function detectCriteria(message) {
  const text = prepare(message)
  const criteria = CRITERIA.filter((criterion) => mentions(text, criterion.words))
  const budgetMatch = normalizeText(message).match(BUDGET_PATTERN)
  const maxBudget = budgetMatch ? Number(budgetMatch[1].replace(/\s/g, '')) * 100 : null

  return {
    criteria,
    maxBudget: maxBudget > 0 ? maxBudget : null,
    wantsAdvisor: mentions(text, ADVISOR_WORDS),
    isGreeting: mentions(text, GREETING_WORDS),
  }
}

function scoreProduct(product, { criteria, maxBudget, contextProduct }) {
  if (maxBudget && product.price > maxBudget) return null
  const typeCriteria = criteria.filter((criterion) => criterion.group === 'type')
  if (typeCriteria.length > 0 && !typeCriteria.some((criterion) => criterion.match(product))) return null

  const reasons = []
  let score = 0
  for (const criterion of criteria) {
    if (!criterion.match(product)) continue
    score += criterion.group === 'type' ? 3 : criterion.weight
    reasons.push(criterion.label)
  }
  if (contextProduct) {
    // Pour accompagner un produit : même pièce et type différent obligatoires
    // (une lampe ou un miroir plutôt qu'un deuxième canapé), puis bonus si le style est commun.
    const sharedRoom = product.rooms.find((room) => contextProduct.rooms.includes(room))
    if (!sharedRoom || product.type === contextProduct.type) return null
    score += 2.5
    reasons.push(`pour ${ROOM_LABELS[sharedRoom] ?? sharedRoom}`)
    if (product.style === contextProduct.style) {
      score += 2
      reasons.push(`même style que ${contextProduct.name}`)
    }
  }
  if (score === 0) return null
  if (maxBudget) reasons.push('dans votre budget')
  if (product.availability === 'out_of_stock') reasons.push('actuellement indisponible')
  if (product.availability === 'out_of_stock') score -= 2 // indisponible : relégué en fin de liste
  if (product.featured) score += 0.25 // départage les ex aequo
  return { productId: product.id, score, reasons }
}

export const QUICK_SUGGESTIONS = [
  'Je cherche un canapé pour un petit salon.',
  'Je veux une lampe chaleureuse.',
  'Quel objet convient à un intérieur minimaliste ?',
  'Je souhaite prendre rendez-vous.',
]

// Point d'entrée : (demande, catalogue) → réponse structurée, toujours de la même forme.
export function recommend(message, products, { contextProductId, limit = 3 } = {}) {
  const contextProduct = products.find((product) => product.id === contextProductId) ?? null
  // Le nom du produit de contexte (« Canapé Lune ») ne doit pas devenir un critère de recherche.
  const detected = detectCriteria(contextProduct ? normalizeText(message).replace(normalizeText(contextProduct.name), ' ') : message)
  const hasProductCriteria = detected.criteria.length > 0 || Boolean(detected.maxBudget) || Boolean(contextProduct)

  const recommendations = hasProductCriteria
    ? products
        .filter((product) => product.id !== contextProduct?.id)
        .map((product) => scoreProduct(product, { ...detected, contextProduct }))
        .filter(Boolean)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ productId, reasons }) => ({ productId, reason: capitalize(reasons.join(' · ')) }))
    : []

  const labels = detected.criteria.map((criterion) => criterion.label)
  if (detected.maxBudget) labels.push(`moins de ${detected.maxBudget / 100} €`)

  if (detected.wantsAdvisor) {
    return {
      intent: 'advisor',
      message:
        'Avec plaisir. Nos conseillers vous accompagnent lors d’une consultation découverte offerte de 30 minutes, en boutique ou en visio.' +
        (recommendations.length ? ' En attendant, voici quelques pièces qui pourraient vous plaire.' : ''),
      recommendations,
      suggestBooking: true,
      bookingTypeId: 'decouverte',
    }
  }

  if (recommendations.length > 0) {
    const about = labels.length ? ` (${labels.join(', ')})` : contextProduct ? ` pour accompagner ${contextProduct.name}` : ''
    return {
      intent: 'recommendation',
      message: `Voici ${recommendations.length > 1 ? `${recommendations.length} pièces` : 'une pièce'} de la collection qui correspond${recommendations.length > 1 ? 'ent' : ''} à votre demande${about}.`,
      recommendations,
      suggestBooking: false,
    }
  }

  if (hasProductCriteria) {
    return {
      intent: 'no_match',
      message: `Je n’ai trouvé aucune pièce de la collection qui réunisse tous ces critères (${labels.join(', ')}). Essayez d’en retirer un, d’élargir le budget, ou parlez-en à un conseiller.`,
      recommendations: [],
      suggestBooking: true,
      bookingTypeId: 'decouverte',
    }
  }

  if (detected.isGreeting) {
    return {
      intent: 'greeting',
      message: 'Bonjour ! Décrivez-moi la pièce à aménager, le style recherché ou votre budget, et je vous propose des pièces de la collection.',
      recommendations: [],
      suggestBooking: false,
    }
  }

  return {
    intent: 'unknown',
    message:
      'Je n’ai pas bien compris votre demande. Je peux vous aider à trouver un canapé, un luminaire, une pièce de décoration ou de bureau — précisez un style, une pièce ou un budget — ou vous mettre en relation avec un conseiller.',
    recommendations: [],
    suggestBooking: false,
  }
}

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1)
