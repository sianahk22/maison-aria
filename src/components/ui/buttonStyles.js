// Styles des boutons, séparés du composant pour pouvoir les appliquer aussi à un <a> classique.
const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-medium transition ' +
  'duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'

const variants = {
  primary: 'bg-ink text-ivory hover:bg-espresso',
  accent: 'bg-terracotta-deep text-white hover:bg-espresso',
  secondary: 'border border-ink/80 text-ink hover:bg-ink hover:text-ivory',
  light: 'bg-white/90 text-ink backdrop-blur hover:bg-white',
  outlineLight: 'border border-ivory/70 text-ivory hover:bg-ivory/10', // sur fond sombre ou photo
  ghost: 'text-ink underline-offset-4 hover:underline',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export function buttonClasses({ variant = 'primary', size = 'md', className = '' } = {}) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`
}

export const buttonClassesForAnchor = buttonClasses({ className: 'mt-8' })
