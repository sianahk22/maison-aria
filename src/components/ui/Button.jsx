import { Link } from 'react-router'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

const variants = {
  primary: 'bg-charcoal text-ivory hover:bg-terracotta-deep',
  secondary: 'border border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory',
  ghost: 'text-charcoal underline-offset-4 hover:underline',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

function buttonClasses({ variant = 'primary', size = 'md', className = '' }) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`
}

export function Button({ variant, size, className, type = 'button', ...props }) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...props} />
}

// Même apparence qu'un bouton, mais c'est un lien : à utiliser pour naviguer vers une autre page.
export function ButtonLink({ variant, size, className, ...props }) {
  return <Link className={buttonClasses({ variant, size, className })} {...props} />
}
