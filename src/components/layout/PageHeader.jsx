import { Container } from '../ui/Container'

// En-tête commun : chaque page a un seul <h1>, et React 19 place <title> dans le <head>.
export function PageHeader({ eyebrow, title, description, children }) {
  return (
    <>
      <title>{`${title} — AURA Studio (démo)`}</title>
      <Container className="pt-12 pb-8 sm:pt-16">
        {eyebrow && (
          <p className="text-xs font-medium tracking-[0.2em] text-terracotta-deep uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-charcoal/80">{description}</p>
        )}
        {children}
      </Container>
    </>
  )
}
