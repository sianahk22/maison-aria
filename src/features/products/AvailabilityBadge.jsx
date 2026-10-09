import { Badge } from '../../components/ui/Badge'
import { AVAILABILITY } from '../../data/products'

const tones = { in_stock: 'sage', made_to_order: 'gold', out_of_stock: 'neutral' }

export function AvailabilityBadge({ availability, className }) {
  return (
    <Badge tone={tones[availability]} className={className}>
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${availability === 'out_of_stock' ? 'bg-stone' : 'bg-ink'}`}
      />
      {AVAILABILITY[availability]}
    </Badge>
  )
}
