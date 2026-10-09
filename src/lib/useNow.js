import { useEffect, useState } from 'react'

// L'heure actuelle, rafraîchie régulièrement : un créneau qui devient « passé »
// pendant que la page est ouverte disparaît tout seul.
export function useNow(refreshMs = 60000) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), refreshMs)
    return () => clearInterval(timer)
  }, [refreshMs])

  return now
}
