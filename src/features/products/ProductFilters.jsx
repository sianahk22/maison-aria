import { Icon } from '../../components/ui/Icon'
import { CATEGORIES } from '../../data/products'
import { PRICE_RANGES, SORT_OPTIONS } from './productFiltering'

const fieldClass =
  'h-12 w-full rounded-full border border-ink/15 bg-white px-5 text-sm text-ink focus:border-ink'

export function ProductFilters({ filters, onChange }) {
  return (
    <form role="search" onSubmit={(event) => event.preventDefault()} className="space-y-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-[1fr_auto_auto]">
        <div className="relative col-span-2 md:col-span-1">
          <label htmlFor="shop-search" className="sr-only">
            Rechercher un produit
          </label>
          <Icon
            name="search"
            className="pointer-events-none absolute top-1/2 left-5 h-4 w-4 -translate-y-1/2 text-stone-deep"
          />
          <input
            id="shop-search"
            type="search"
            value={filters.query}
            onChange={(event) => onChange({ query: event.target.value })}
            placeholder="Rechercher : canapé, lampe, chêne…"
            className={`${fieldClass} pl-11`}
          />
        </div>

        <div>
          <label htmlFor="shop-price" className="sr-only">
            Filtrer par prix
          </label>
          <select
            id="shop-price"
            value={filters.price}
            onChange={(event) => onChange({ price: event.target.value })}
            className={`${fieldClass} min-w-0 pr-8 md:w-52`}
          >
            {PRICE_RANGES.map((range) => (
              <option key={range.id} value={range.id}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="shop-sort" className="sr-only">
            Trier les produits
          </label>
          <select
            id="shop-sort"
            value={filters.sort}
            onChange={(event) => onChange({ sort: event.target.value })}
            className={`${fieldClass} min-w-0 pr-8 md:w-48`}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Boutons radio natifs habillés en « pastilles » : navigation clavier avec les flèches. */}
      <fieldset>
        <legend className="sr-only">Catégorie</legend>
        <div className="flex flex-wrap gap-2">
          {[{ id: 'all', label: 'Toutes' }, ...CATEGORIES].map((category) => (
            <label key={category.id} className="cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={filters.category === category.id}
                onChange={() => onChange({ category: category.id })}
                className="peer sr-only"
              />
              <span className="inline-flex min-h-11 items-center rounded-full border border-ink/15 px-5 text-sm transition peer-checked:border-ink peer-checked:bg-ink peer-checked:text-ivory peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-terracotta-deep hover:border-ink">
                {category.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </form>
  )
}
