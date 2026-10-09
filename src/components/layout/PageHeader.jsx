import { pageTitle } from '../../app/brand'
import { Container } from '../ui/Container'

// En-tête commun : un seul <h1> par page ; React 19 place <title> dans le <head>.
export function PageHeader({ eyebrow, title, description, children }) {
  return (
    <>
      <title>{pageTitle(title)}</title>
      <Container className="animate-fade-up pt-10 pb-8 sm:pt-16 sm:pb-10">
        {eyebrow && (
          <p className="text-xs font-medium tracking-[0.25em] text-terracotta-deep uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-6xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-deep sm:text-lg">
            {description}
          </p>
        )}
        {children}
      </Container>
    </>
  )
}
