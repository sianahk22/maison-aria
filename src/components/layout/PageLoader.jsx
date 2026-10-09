import { Container } from '../ui/Container'

// Affiché pendant le chargement d'une page ou de ses données (squelette discret).
export function PageLoader({ label = 'Chargement…' }) {
  return (
    <Container className="py-16" role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className="animate-pulse space-y-6">
        <div className="h-4 w-32 rounded-full bg-sand" />
        <div className="h-12 w-2/3 max-w-xl rounded-2xl bg-sand" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="aspect-[4/5] rounded-3xl bg-sand" />
          ))}
        </div>
      </div>
    </Container>
  )
}
