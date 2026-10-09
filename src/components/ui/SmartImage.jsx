import { useState } from 'react'
import { IMAGE_FALLBACK } from '../../data/images'
import { imageSrcSet, imageUrl } from '../../lib/images'

// Image responsive avec image de secours si le chargement échoue.
// - `ratio` (hauteur / largeur) réserve la place : la page ne « saute » pas au chargement.
// - `priority` pour l'image principale visible dès l'arrivée ; sinon chargement différé (lazy).
// - `detail` affiche la vue rapprochée d'un produit.
export function SmartImage({ image, ratio = 1.25, sizes = '100vw', priority = false, detail = false, className = '' }) {
  const src = imageUrl(image, { width: 800, detail })
  const [failedSrc, setFailedSrc] = useState(null)
  const failed = failedSrc === src

  return (
    <img
      src={failed ? IMAGE_FALLBACK : src}
      srcSet={failed ? undefined : imageSrcSet(image, { detail })}
      sizes={sizes}
      alt={image.alt}
      width={800}
      height={Math.round(800 * ratio)}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      onError={() => setFailedSrc(src)}
      className={`h-full w-full bg-sand object-cover ${className}`}
    />
  )
}
