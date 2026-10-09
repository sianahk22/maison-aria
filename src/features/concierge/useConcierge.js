import { useRef, useState } from 'react'
import { askConcierge } from '../../services/conciergeService'

const WELCOME = {
  id: 'welcome',
  role: 'assistant',
  text: 'Bonjour, je suis ARIA, l’assistante (simulée) de Maison Aria. Décrivez-moi votre pièce, votre style ou votre budget : je vous propose des pièces de notre collection.',
  recommendations: [],
}

// État de la conversation : messages, « réflexion » en cours, erreur éventuelle.
export function useConcierge({ contextProductId } = {}) {
  const [messages, setMessages] = useState([WELCOME])
  const [thinking, setThinking] = useState(false)
  const pending = useRef(false)
  const nextId = useRef(1)

  async function send(text) {
    const message = text.trim()
    if (!message || pending.current) return
    pending.current = true
    setThinking(true)
    setMessages((list) => [...list, { id: `u${nextId.current++}`, role: 'user', text: message }])

    try {
      const response = await askConcierge({ message, contextProductId })
      setMessages((list) => [...list, { id: `a${nextId.current++}`, role: 'assistant', text: response.message, ...response }])
    } catch {
      setMessages((list) => [
        ...list,
        {
          id: `e${nextId.current++}`,
          role: 'assistant',
          text: 'Désolée, je n’ai pas pu traiter votre demande. Réessayez dans un instant.',
          recommendations: [],
          isError: true,
        },
      ])
    } finally {
      pending.current = false
      setThinking(false)
    }
  }

  return { messages, thinking, send }
}
