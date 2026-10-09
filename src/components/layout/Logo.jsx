import { Link } from 'react-router'
import { ROUTES } from '../../app/routes'

function Monogram({ className = 'h-9 w-9 text-sm' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-ink/80 font-serif tracking-wider ${className}`}
    >
      MA
    </span>
  )
}

export function Logo({ onClick, inverted = false }) {
  return (
    <Link
      to={ROUTES.home}
      onClick={onClick}
      className={`flex items-center gap-3 ${inverted ? 'text-ivory' : 'text-ink'}`}
    >
      <Monogram className={`h-9 w-9 text-xs ${inverted ? 'border-ivory/80' : ''}`} />
      <span className="font-serif text-base tracking-[0.2em] whitespace-nowrap sm:text-xl sm:tracking-[0.28em]">
        MAISON ARIA
      </span>
      <span className="sr-only">— retour à l'accueil</span>
    </Link>
  )
}
