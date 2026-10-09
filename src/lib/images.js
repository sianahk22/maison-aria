// Chemins des images locales (public/images/). Chaque image existe en plusieurs largeurs :
// le navigateur choisit la plus adaptée à l'écran grâce à `srcset` (pas d'image géante sur mobile).
const fileFor = (image, width) => `${image.file}-${width}.webp`

export function imageUrl(image, { width = 800, detail = false } = {}) {
  if (detail && image.detail) return image.detail
  const best = image.widths.find((candidate) => candidate >= width) ?? image.widths.at(-1)
  return fileFor(image, best)
}

export function imageSrcSet(image, { detail = false } = {}) {
  if (detail && image.detail) return undefined
  return image.widths.map((width) => `${fileFor(image, width)} ${width}w`).join(', ')
}
