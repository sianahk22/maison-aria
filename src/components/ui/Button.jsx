import { Link } from 'react-router'
import { buttonClasses } from './buttonStyles'

export function Button({ variant, size, className, type = 'button', ...props }) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...props} />
}

// Même apparence qu'un bouton, mais c'est un lien : à utiliser pour changer de page.
export function ButtonLink({ variant, size, className, ...props }) {
  return <Link className={buttonClasses({ variant, size, className })} {...props} />
}
