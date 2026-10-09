// Vite accepte les imports sans extension (`./cartLogic`), Node non.
// Ce petit « hook » ajoute `.js` quand le fichier demandé n'existe pas tel quel. Utilisé uniquement par `npm test`.
import { registerHooks } from 'node:module'

registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context)
    } catch (error) {
      if (specifier.startsWith('.') || specifier.startsWith('/')) return nextResolve(`${specifier}.js`, context)
      throw error
    }
  },
})
