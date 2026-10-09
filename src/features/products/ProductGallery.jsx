import { useState } from 'react'
import { SmartImage } from '../../components/ui/SmartImage'

// Galerie simple : vue d'ensemble + vue rapprochée (même photo, recadrage serré).
const VIEWS = [
  { id: 'main', label: 'Vue d’ensemble' },
  { id: 'detail', label: 'Vue rapprochée', detail: true },
]

export function ProductGallery({ product }) {
  const [activeId, setActiveId] = useState('main')
  const active = VIEWS.find((view) => view.id === activeId)

  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-[4/5] overflow-hidden rounded-3xl">
        <SmartImage
          key={active.id}
          image={product.image}
          detail={active.detail}
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="animate-fade-up"
        />
      </div>
      <div className="flex gap-3" role="group" aria-label="Choisir une vue">
        {VIEWS.map((view) => (
          <button
            key={view.id}
            type="button"
            aria-pressed={view.id === activeId}
            onClick={() => setActiveId(view.id)}
            className={`h-20 w-16 overflow-hidden rounded-2xl border-2 transition ${
              view.id === activeId ? 'border-ink' : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <SmartImage image={{ ...product.image, alt: '' }} detail={view.detail} sizes="64px" />
            <span className="sr-only">{view.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
