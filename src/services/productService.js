// Accès au catalogue. Aujourd'hui : données locales avec un court délai simulé.
// Demain : remplacer le corps de `listProducts` par un appel HTTP, par exemple
//   fetch('/api/products').then((response) => response.json())
// Les composants n'ont pas à changer : ils reçoivent toujours une promesse de produits.
import { products } from '../data/products'
import { wait } from '../lib/wait'

let productsPromise

// La promesse est mise en cache : React (`use`) a besoin de recevoir la même à chaque rendu.
export function listProducts() {
  productsPromise ??= wait(250).then(() => products)
  return productsPromise
}
