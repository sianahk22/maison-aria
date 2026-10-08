export function Card({ as: Component = 'div', className = '', ...props }) {
  return (
    <Component
      className={`rounded-2xl border border-charcoal/10 bg-white p-6 shadow-sm ${className}`}
      {...props}
    />
  )
}
