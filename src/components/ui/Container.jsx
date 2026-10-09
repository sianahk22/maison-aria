// Largeur maximale et marges latérales communes à toutes les pages.
export function Container({ className = '', ...props }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 ${className}`} {...props} />
}
