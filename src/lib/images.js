// Construit les URL d'images. Le CDN Unsplash accepte des paramètres de taille :
// on demande seulement la taille nécessaire (pas d'image géante sur mobile).
const UNSPLASH_BASE = 'https://images.unsplash.com/photo-'

export function imageUrl(image, { width = 800, ratio, quality = 70, zoom } = {}) {
  if (image.src) return image.src // image locale (public/images/)

  const params = new URLSearchParams({ auto: 'format', fit: 'crop', w: String(width), q: String(quality) })
  if (ratio) params.set('h', String(Math.round(width * ratio)))
  // `focusY` (0 = haut, 1 = bas) choisit la zone conservée lors du recadrage ; `zoom` rapproche.
  if (zoom || image.focusY !== undefined) {
    params.set('crop', 'focalpoint')
    params.set('fp-x', '0.5')
    params.set('fp-y', String(image.focusY ?? 0.5))
    if (zoom) params.set('fp-z', String(zoom))
  }
  return `${UNSPLASH_BASE}${image.id}?${params}`
}

// Plusieurs tailles : le navigateur choisit la plus adaptée à l'écran (attribut srcset).
export function imageSrcSet(image, { widths = [480, 800, 1200], ...options } = {}) {
  if (image.src) return undefined
  return widths.map((width) => `${imageUrl(image, { ...options, width })} ${width}w`).join(', ')
}
