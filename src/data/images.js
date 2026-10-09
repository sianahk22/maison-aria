// ─────────────────────────────────────────────────────────────────────────────
// Toutes les images du site sont déclarées ICI, et nulle part ailleurs.
//
// ⚠️ Photos d'illustration provenant d'Unsplash (licence Unsplash), servies par leur CDN.
//    Elles ne représentent pas de vrais produits Maison Aria (marque fictive).
//    À remplacer par des visuels sous licence commerciale ou par de vraies photos
//    produits avant toute utilisation commerciale.
//
// Pour utiliser une image locale : déposez le fichier dans public/images/ puis
// remplacez `id` par `src: '/images/mon-fichier.jpg'` (voir public/images/README.md).
// Chaque image a un texte alternatif décrivant ce qu'on voit réellement.
// ─────────────────────────────────────────────────────────────────────────────

export const IMAGE_FALLBACK = '/images/placeholder.svg'

export const sceneImages = {
  hero: {
    id: '1618221195710-dd6b41faaea6',
    focusY: 0.75, // garde le salon plutôt que le plafond
    alt: 'Salon lumineux avec canapé gris, table basse en bois, poufs terracotta et lampadaire arqué',
  },
  living: {
    id: '1600210492486-724fe5c67fb0',
    alt: 'Séjour aux murs blancs avec canapé clair, plantes vertes et cadres photo au mur',
  },
  reading: {
    id: '1586023492125-27b2c045efd7',
    alt: 'Coin lecture avec fauteuil jaune, lampadaire doré et affiche graphique',
  },
  concierge: {
    id: '1618220179428-22790b461013',
    alt: 'Intérieur chaleureux avec fauteuil orange, console dorée, miroir rond et plantes',
  },
  exterior: {
    id: '1600585154340-be6161a56a0c',
    alt: "Maison contemporaine au crépuscule, grandes baies vitrées éclairées et pelouse sous un arbre",
  },
}

export const productImages = {
  'canape-lune': { id: '1555041469-a586c61ea9bc', alt: 'Canapé trois places en velours vert sapin sur parquet clair' },
  'canape-sienne': { id: '1567016432779-094069958ea5', alt: 'Canapé compact terracotta avec coussin rose, sur fond vert' },
  'canape-oslo': { id: '1540574163026-643ea20ade25', alt: 'Canapé trois places en cuir cognac contre un mur blanc' },
  'fauteuil-celeste': { id: '1567538096630-e0c55bd6374c', alt: 'Fauteuil capitonné ivoire aux pieds tournés blancs' },
  'fauteuil-soleil': { id: '1550226891-ef816aed4a98', alt: 'Fauteuil moutarde avec repose-pieds, à côté d’une table de chevet et d’une lampe' },
  'chaises-emeraude': { id: '1617806118233-18e1de247200', alt: 'Salle à manger avec chaises en velours vert émeraude autour d’une table blanche' },
  'lampadaire-atelier': { id: '1507473885765-e6ed057f782c', alt: 'Lampadaire gris anthracite à abat-jour orientable sur fond blanc' },
  'suspension-halo': { id: '1513506003901-1e6a229e2d15', alt: 'Suspension grise en forme de cloche sur fond bleu canard' },
  'suspension-lin': { id: '1524484485831-a92ffc0de03f', alt: 'Suspension blanche au-dessus d’une table en bois avec une plante' },
  'miroirs-rotin': { id: '1631679706909-1844bbd07221', alt: 'Deux miroirs ronds en rotin au-dessus d’un canapé clair' },
  'vase-dune': { id: '1612196808214-b8e1d6145a8c', alt: 'Vase en céramique crème posé sur un socle en bois, devant une affiche' },
  'etagere-sable': { id: '1595428774223-ef52624120d2', alt: 'Colonne de rangement murale en bois clair sur un mur rose poudré' },
  'chaise-atelier': { id: '1598300042247-d088f8ab3a91', alt: 'Chaise rembourrée grise aux pieds en bois clair' },
  'bureau-nordique': { id: '1530018607912-eff2daa1bac4', alt: 'Bureau console en bois avec tiroirs et petite plante verte' },
  'tabouret-studio': { id: '1503602642458-232111445657', alt: 'Tabouret en bois clair sur fond bleu ciel' },
  'fauteuil-cognac': { id: '1572297794908-f2ee5a2930d6', alt: 'Fauteuil pivotant en cuir cognac sur pied métallique' },
  'table-calanque': { id: '1604014237800-1c9102c219da', alt: 'Terrasse couverte avec table et chaises d’extérieur face au jardin' },
  'chaises-pop': { id: '1551298370-9d3d53740c72', alt: 'Deux chaises coques, une jaune et une grise, sur fond sombre' },
  'salon-horizon': { id: '1600573472550-8090b5e0745e', alt: 'Terrasse avec mobilier d’extérieur, garde-corps vitré et vue dégagée' },
}
