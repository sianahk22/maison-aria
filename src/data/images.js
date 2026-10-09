// ─────────────────────────────────────────────────────────────────────────────
// Toutes les images du site sont déclarées ICI, et nulle part ailleurs.
//
// Les fichiers sont LOCAUX, dans public/images/ (WebP, plusieurs largeurs) : le site ne
// dépend d'aucun service externe pour ses images.
//
// ⚠️ Ce sont des photos d'illustration issues d'Unsplash (licence Unsplash), recadrées et
//    converties. Elles ne représentent pas de vrais produits Maison Aria (marque fictive).
//    À remplacer par des visuels sous licence commerciale ou de vraies photos produits avant
//    toute utilisation commerciale. Liste et sources : public/images/CREDITS.md.
//
// `unsplashId` : identifiant d'origine (traçabilité). `focusX`, `focusY`, `detailFocus` :
// zones conservées lors du recadrage des fichiers. `alt` : décrit ce qu'on voit réellement.
// Pour remplacer une image : déposer `nom-480.webp` et `nom-800.webp` (et `nom-detail.webp`
// pour un produit) dans le bon dossier, en gardant le même nom.
// ─────────────────────────────────────────────────────────────────────────────

export const IMAGE_FALLBACK = '/images/placeholder.svg'

const sceneSources = {
  hero: {
    unsplashId: '1618221195710-dd6b41faaea6',
    focusY: 0.75, // garde le salon plutôt que le plafond
    alt: 'Salon lumineux avec canapé gris, table basse en bois, poufs terracotta et lampadaire arqué',
  },
  living: {
    unsplashId: '1600210492486-724fe5c67fb0',
    alt: 'Séjour aux murs blancs avec canapé clair, plantes vertes et cadres photo au mur',
  },
  concierge: {
    unsplashId: '1618220179428-22790b461013',
    alt: 'Intérieur chaleureux avec fauteuil orange, console dorée, miroir rond et plantes',
  },
  exterior: {
    unsplashId: '1600585154340-be6161a56a0c',
    alt: "Maison contemporaine au crépuscule, grandes baies vitrées éclairées et pelouse sous un arbre",
  },
}

const productSources = {
  'canape-lune': { unsplashId: '1555041469-a586c61ea9bc', alt: 'Canapé trois places en velours vert sapin sur parquet clair' },
  'canape-sienne': { unsplashId: '1567016432779-094069958ea5', alt: 'Canapé compact terracotta avec coussin rose, sur fond vert' },
  'canape-oslo': { unsplashId: '1540574163026-643ea20ade25', alt: 'Canapé trois places en cuir cognac contre un mur blanc' },
  'fauteuil-celeste': { unsplashId: '1567538096630-e0c55bd6374c', alt: 'Fauteuil capitonné ivoire aux pieds tournés blancs' },
  'fauteuil-soleil': { unsplashId: '1550226891-ef816aed4a98', alt: 'Fauteuil moutarde avec repose-pieds, à côté d’une table de chevet et d’une lampe' },
  'chaises-emeraude': { unsplashId: '1617806118233-18e1de247200', alt: 'Salle à manger avec chaises en velours vert émeraude autour d’une table blanche' },
  'lampadaire-atelier': { unsplashId: '1507473885765-e6ed057f782c', alt: 'Lampadaire gris anthracite à abat-jour orientable sur fond blanc' },
  'suspension-halo': { unsplashId: '1513506003901-1e6a229e2d15', focusX: 0.33, detailFocus: { x: 0.3, y: 0.55 }, alt: 'Suspension grise en forme de cloche sur fond bleu canard' },
  'suspension-lin': { unsplashId: '1524484485831-a92ffc0de03f', alt: 'Suspension blanche au-dessus d’une table en bois avec une plante' },
  'miroirs-rotin': { unsplashId: '1631679706909-1844bbd07221', alt: 'Deux miroirs ronds en rotin au-dessus d’un canapé clair' },
  'vase-dune': { unsplashId: '1612196808214-b8e1d6145a8c', alt: 'Vase en céramique crème posé sur un socle en bois, devant une affiche' },
  'etagere-sable': { unsplashId: '1595428774223-ef52624120d2', alt: 'Colonne de rangement murale en bois clair sur un mur rose poudré' },
  'chaise-atelier': { unsplashId: '1598300042247-d088f8ab3a91', alt: 'Chaise rembourrée grise aux pieds en bois clair' },
  'bureau-nordique': { unsplashId: '1530018607912-eff2daa1bac4', alt: 'Bureau console en bois avec tiroirs et petite plante verte' },
  'tabouret-studio': { unsplashId: '1503602642458-232111445657', alt: 'Tabouret en bois clair sur fond bleu ciel' },
  'fauteuil-cognac': { unsplashId: '1572297794908-f2ee5a2930d6', alt: 'Fauteuil pivotant en cuir cognac sur pied métallique' },
  'table-calanque': { unsplashId: '1604014237800-1c9102c219da', focusX: 0.82, detailFocus: { x: 0.85, y: 0.7 }, alt: 'Terrasse couverte avec table et chaises d’extérieur face au jardin' },
  'chaises-pop': { unsplashId: '1551298370-9d3d53740c72', alt: 'Deux chaises coques, une jaune et une grise, sur fond sombre' },
  'salon-horizon': { unsplashId: '1600573472550-8090b5e0745e', focusX: 0.3, detailFocus: { x: 0.3, y: 0.68 }, alt: 'Terrasse avec mobilier d’extérieur, garde-corps vitré et vue dégagée' },
}

const SCENE_WIDTHS = { hero: [640, 1200], living: [640, 1200], concierge: [480, 800], exterior: [960, 1600] }
const PRODUCT_WIDTHS = [480, 800]

const mapEntries = (object, transform) =>
  Object.fromEntries(Object.entries(object).map(([key, value]) => [key, transform(value, key)]))

export const sceneImages = mapEntries(sceneSources, (image, key) => ({
  ...image,
  file: `/images/scenes/${key}`,
  widths: SCENE_WIDTHS[key],
}))

export const productImages = mapEntries(productSources, (image, key) => ({
  ...image,
  file: `/images/products/${key}`,
  widths: PRODUCT_WIDTHS,
  detail: `/images/products/${key}-detail.webp`,
}))
