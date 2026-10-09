// ─────────────────────────────────────────────────────────────────────────────
// CONSULTATIONS FICTIVES — consultants, tarifs et horaires inventés (démonstration).
// ─────────────────────────────────────────────────────────────────────────────

export const CONSULTATION_TYPES = [
  {
    id: 'decouverte',
    name: 'Consultation découverte',
    durationMin: 30,
    price: 0,
    description: 'Un premier échange pour cerner vos envies, votre budget et vos contraintes.',
  },
  {
    id: 'conseil-deco',
    name: 'Conseil décoration',
    durationMin: 45,
    price: 6000,
    description: 'Couleurs, textiles, luminaires : des conseils concrets pour une pièce.',
  },
  {
    id: 'projet-amenagement',
    name: 'Projet d’aménagement',
    durationMin: 60,
    price: 12000,
    description: 'Plan d’implantation, circulation et sélection de mobilier sur mesure.',
  },
  {
    id: 'premium',
    name: 'Consultation premium',
    durationMin: 90,
    price: 22000,
    description: 'Un accompagnement approfondi pour plusieurs pièces, avec planche d’ambiance.',
  },
]

export const FORMATS = [
  { id: 'boutique', label: 'En boutique', description: 'Au showroom Maison Aria (adresse fictive)' },
  { id: 'visio', label: 'En visio', description: 'Lien de connexion envoyé par email (simulé)' },
]

export const CONSULTANTS = [
  {
    id: 'clara',
    name: 'Clara Morel',
    title: 'Architecte d’intérieur',
    consultationTypeIds: ['decouverte', 'conseil-deco', 'projet-amenagement', 'premium'],
    formatIds: ['boutique', 'visio'],
  },
  {
    id: 'hugo',
    name: 'Hugo Lambert',
    title: 'Décorateur',
    consultationTypeIds: ['decouverte', 'conseil-deco', 'projet-amenagement'],
    formatIds: ['boutique', 'visio'],
  },
  {
    id: 'ines',
    name: 'Inès Garnier',
    title: 'Conseillère mobilier',
    consultationTypeIds: ['decouverte', 'conseil-deco'],
    formatIds: ['boutique'],
  },
]

// Horaires hebdomadaires, heure de Paris. Clé = jour (0 dimanche … 6 samedi).
export const SCHEDULE = {
  clara: {
    1: [['09:30', '12:30'], ['14:00', '18:30']],
    2: [['09:30', '12:30'], ['14:00', '18:30']],
    4: [['09:30', '12:30'], ['14:00', '18:30']],
    5: [['09:30', '12:30'], ['14:00', '18:30']],
    6: [['10:00', '13:00']],
  },
  hugo: {
    2: [['10:00', '13:00'], ['14:00', '19:00']],
    3: [['10:00', '13:00'], ['14:00', '19:00']],
    4: [['10:00', '13:00'], ['14:00', '19:00']],
    5: [['10:00', '13:00'], ['14:00', '19:00']],
    6: [['10:00', '13:00'], ['14:00', '17:00']],
  },
  ines: {
    1: [['09:30', '12:30'], ['13:30', '17:30']],
    3: [['09:30', '12:30'], ['13:30', '17:30']],
    5: [['09:30', '12:30'], ['13:30', '17:30']],
    6: [['10:00', '13:00'], ['14:00', '17:00']],
  },
}

export const BOOKING_RULES = {
  slotStepMin: 30, // un créneau peut commencer toutes les 30 minutes
  horizonDays: 21, // réservation possible jusqu'à 3 semaines à l'avance
  minNoticeMin: 120, // pas de réservation à moins de 2 h
}
