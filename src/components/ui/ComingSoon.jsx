import { Badge } from './Badge'
import { Card } from './Card'
import { Container } from './Container'

// Bloc provisoire affiché sur les pages pas encore développées.
export function ComingSoon({ step, children }) {
  return (
    <Container>
      <Card className="flex flex-col items-start gap-4 border-dashed">
        <Badge tone="sage">En construction — étape {step}</Badge>
        <p className="max-w-2xl leading-relaxed text-charcoal/80">{children}</p>
      </Card>
    </Container>
  )
}
