// Petit jeu d'icônes SVG maison (évite une dépendance). Décoratives par défaut :
// le texte du bouton ou un libellé masqué porte le sens pour les lecteurs d'écran.
const PATHS = {
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  bag: 'M6 8h12l-1 12H7L6 8zm3 0V6a3 3 0 016 0v2',
  search: 'M11 18a7 7 0 100-14 7 7 0 000 14zm9 2l-4.35-4.35',
  arrowRight: 'M5 12h14m-6-6l6 6-6 6',
  arrowLeft: 'M19 12H5m6 6l-6-6 6-6',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  trash: 'M5 7h14M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3',
  calendar: 'M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z',
  chat: 'M5 5h14a1 1 0 011 1v10a1 1 0 01-1 1H9l-4 4V6a1 1 0 011-1z',
  check: 'M5 12l5 5L20 7',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0',
  send: 'M4 12l16-8-6 16-2-6-8-2z',
  alert: 'M12 8v5m0 3h.01M10.3 3.9L2.5 18a2 2 0 001.7 3h15.6a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z',
  filter: 'M4 6h16M7 12h10M10 18h4',
}

export function Icon({ name, className = 'h-5 w-5', title }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title && <title>{title}</title>}
      <path d={PATHS[name]} />
    </svg>
  )
}
