import { useEffect, useState } from 'react'
import { getAriaMode } from '../../services/conciergeService'

const CHECKING = { mode: 'checking', label: 'Vérification du mode de l’assistant…' }

// Mode d'ARIA (IA réelle ou simulé), sans bloquer l'affichage de la page :
// la page s'affiche tout de suite, puis le mode réel apparaît dès que le serveur a répondu.
export function useAriaMode() {
  const [ariaMode, setAriaMode] = useState(CHECKING)

  useEffect(() => {
    let active = true
    getAriaMode().then((mode) => active && setAriaMode(mode))
    return () => {
      active = false
    }
  }, [])

  return ariaMode
}
