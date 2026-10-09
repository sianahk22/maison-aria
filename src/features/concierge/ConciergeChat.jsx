import { use, useEffect, useRef, useState } from 'react'
import { ROUTES } from '../../app/routes'
import { ButtonLink } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import { QUICK_SUGGESTIONS } from '../../lib/recommendationEngine'
import { MAX_MESSAGE_LENGTH, getAriaMode } from '../../services/conciergeService'
import { useProducts } from '../products/useProducts'
import { RecommendationCard } from './RecommendationCard'
import { useConcierge } from './useConcierge'

function AssistantAvatar() {
  return (
    <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage/40">
      <Icon name="sparkle" className="h-4 w-4" />
    </span>
  )
}

function Message({ message, productsById }) {
  if (message.role === 'user') {
    return (
      <li className="flex justify-end">
        <p className="max-w-[85%] rounded-3xl rounded-br-md bg-ink px-4 py-3 text-sm leading-relaxed text-ivory">
          <span className="sr-only">Vous : </span>
          {message.text}
        </p>
      </li>
    )
  }

  const recommendations = (message.recommendations ?? [])
    .map((item) => ({ ...item, product: productsById.get(item.productId) }))
    .filter((item) => item.product)

  return (
    <li className="flex gap-3">
      <AssistantAvatar />
      <div className="min-w-0 flex-1 space-y-3">
        <p
          className={`max-w-[95%] rounded-3xl rounded-tl-md px-4 py-3 text-sm leading-relaxed ${
            message.isError ? 'bg-terracotta-deep/10 text-terracotta-deep' : 'bg-white'
          }`}
        >
          <span className="sr-only">ARIA : </span>
          {message.text}
        </p>
        {message.fallback && (
          <p className="text-xs text-stone-deep">Réponse de secours en mode simulé (service IA momentanément indisponible).</p>
        )}
        {recommendations.length > 0 && (
          <ul className="grid gap-2" aria-label="Produits recommandés">
            {recommendations.map((item) => (
              <li key={item.productId}>
                <RecommendationCard product={item.product} reason={item.reason} />
              </li>
            ))}
          </ul>
        )}
        {message.suggestBooking && (
          <ButtonLink to={`${ROUTES.booking}?type=${message.bookingTypeId ?? 'decouverte'}`} size="sm">
            <Icon name="calendar" className="h-4 w-4" />
            Prendre rendez-vous
          </ButtonLink>
        )}
      </div>
    </li>
  )
}

export function ConciergeChat({ contextProduct }) {
  const products = useProducts()
  const ariaMode = use(getAriaMode())
  const productsById = new Map(products.map((product) => [product.id, product]))
  const { messages, thinking, send } = useConcierge({ contextProductId: contextProduct?.id })
  const [draft, setDraft] = useState(() =>
    contextProduct ? `Que me conseillez-vous pour accompagner ${contextProduct.name} ?` : '',
  )
  const logRef = useRef(null)

  // Fait défiler la conversation vers le dernier message.
  useEffect(() => {
    const log = logRef.current
    log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  function submit(text) {
    if (!text.trim() || thinking) return
    send(text)
    setDraft('')
  }

  return (
    <section aria-labelledby="chat-title" className="flex h-[min(78vh,720px)] min-h-[520px] flex-col overflow-hidden rounded-3xl bg-sand/60 shadow-float">
      <header className="flex items-center justify-between gap-3 border-b border-ink/10 bg-white px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <AssistantAvatar />
          <div>
            <h2 id="chat-title" className="font-serif text-lg leading-tight">
              ARIA Concierge
            </h2>
            <p className="text-xs text-stone-deep">{ariaMode.label}</p>
          </div>
        </div>
        <div className="hidden sm:block">
          <ButtonLink to={`${ROUTES.booking}?type=decouverte`} variant="secondary" size="sm">
            Prendre rendez-vous
          </ButtonLink>
        </div>
      </header>

      <ol ref={logRef} role="log" aria-live="polite" aria-label="Conversation avec ARIA" className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-5">
        {messages.map((message) => (
          <Message key={message.id} message={message} productsById={productsById} />
        ))}
        {thinking && (
          <li className="flex items-center gap-3">
            <AssistantAvatar />
            <span className="flex gap-1 rounded-3xl bg-white px-4 py-4" aria-hidden="true">
              {[0, 1, 2].map((index) => (
                <span key={index} className="h-2 w-2 animate-pulse-dot rounded-full bg-stone" style={{ animationDelay: `${index * 0.2}s` }} />
              ))}
            </span>
            <span className="sr-only">ARIA prépare une réponse…</span>
          </li>
        )}
      </ol>

      <div className="border-t border-ink/10 bg-white px-4 pt-3 pb-4 sm:px-5">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Suggestions de questions">
          {QUICK_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => submit(suggestion)}
              disabled={thinking}
              className="min-h-9 shrink-0 rounded-full border border-ink/15 px-3 py-1.5 text-left text-xs whitespace-nowrap hover:border-ink disabled:opacity-50 sm:whitespace-normal"
            >
              {suggestion}
            </button>
          ))}
        </div>
        <form
          className="mt-3 flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            submit(draft)
          }}
        >
          <label htmlFor="concierge-input" className="sr-only">
            Votre message pour ARIA
          </label>
          <input
            id="concierge-input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={MAX_MESSAGE_LENGTH}
            autoComplete="off"
            placeholder="Ex. : un fauteuil pour lire, style vintage"
            className="h-12 min-w-0 flex-1 rounded-full border border-ink/15 bg-ivory px-5 text-base focus:border-ink"
          />
          <button
            type="submit"
            disabled={thinking || !draft.trim()}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-ivory hover:bg-espresso disabled:opacity-40"
          >
            <Icon name="send" className="h-5 w-5" />
            <span className="sr-only">Envoyer</span>
          </button>
        </form>
      </div>
    </section>
  )
}
