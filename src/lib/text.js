// « Canapé Été » → « canape ete » : comparaison insensible aux majuscules et aux accents.
export function normalizeText(text = '') {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9€]+/g, ' ')
    .trim()
}
