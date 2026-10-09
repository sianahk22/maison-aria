import { use } from 'react'
import { listProducts } from '../../services/productService'

// `use` attend la promesse : pendant le chargement, React affiche le <Suspense> le plus proche
// (le squelette de page). En cas d'erreur, la page d'erreur du routeur prend le relais.
export function useProducts() {
  return use(listProducts())
}

export function useProduct(productId) {
  return useProducts().find((product) => product.id === productId) ?? null
}
