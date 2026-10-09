# Aura Studio — instructions projet

Projet **personnel de démonstration** (portfolio) : **Maison Aria**, boutique fictive de mobilier,
décoration et aménagement intérieur — boutique, panier, réservation de consultations, assistant
ARIA Concierge simulé, espace client et tableau de bord simulés.

## Stack

- Vite + React 19, **JavaScript** (pas de TypeScript), React Router 8 (`react-router`, pas `react-router-dom`),
  Tailwind CSS v4, ESLint. Pas de Next.js.
- Aucune autre dépendance. Toute nouvelle dépendance doit être justifiée (utilité, coût, risques) et validée.

## Commandes

- `npm run dev` · `npm run build` · `npm run preview` · `npm run lint`
- **Après chaque étape : `npm run build` et `npm run lint`.** Il n'existe pas de `npm test` : ne pas prétendre le contraire.

## Architecture

- `src/app/` : `routes.js` (seule source des chemins — jamais d'URL en dur), `router.jsx`, `brand.js` (marque et mentions démo).
- `src/pages/` : une page par route ; assemble, sans logique métier.
- `src/features/<domaine>/` : composants, hooks et logique d'une fonctionnalité (products, cart, booking, concierge, account, admin, home).
- Logique **pure** (sans React) : `cartLogic.js`, `productFiltering.js`, `availability.js`, `time.js`,
  `lib/recommendationEngine.js`, `dashboardStats.js`.
- `src/services/` : seuls points d'accès aux données (asynchrones). Les pages n'importent pas `src/data/` pour les données métier.
- `src/data/` : données fictives ; **toutes les images dans `data/images.js`**.
- `src/components/ui|layout` : composants génériques.
- État partagé : `lib/createStore.js` + `lib/useStore.js` (localStorage versionné, validé, synchro entre onglets).

## Règles métier

- Prix en **centimes** (entiers).
- Dates stockées en ISO UTC, affichées en heure de Paris (`features/booking/time.js`).
- Créneaux **calculés**, jamais stockés. Chevauchement : `a.start < b.end && b.start < a.end`.
- `bookingService.createBooking` : idempotence (`requestId`) + **deuxième vérification** sans `await` entre lecture et écriture.
- ARIA ne recommande que des produits du catalogue ; garder le filtrage `keepKnownProducts`.

## Contraintes

- Toujours afficher « Projet personnel de démonstration — Aura Studio » (bandeau + pied de page).
  Ne jamais présenter le projet comme un vrai client ou une vraie entreprise.
- Statistiques : toujours marquées « Données de démonstration » ; jamais de chiffre présenté comme réel.
- Aucune vraie API IA, paiement, base de données, authentification ni email. Aucun service payant.
- Aucun secret dans le code ; variables d'environnement via `.env` (non versionné) + `.env.example`.
- Images : uniquement via `data/images.js`, avec `alt` descriptif ; pas de personnes identifiables ni de marques.

## Pièges connus

- Ne pas mettre `hidden` directement sur `Button`/`ButtonLink` (conflit avec leur `inline-flex`) :
  envelopper dans un `<div className="hidden sm:block">`.
- Grilles avec colonne flexible : `grid-cols-1` / `minmax(0,1fr)` pour éviter le débordement mobile.
- Pas de `Date.now()` / `new Date()` pendant le rendu (règle `react-hooks/purity`) : utiliser `useNow()`.
- Pas deux fichiers dont le nom ne diffère que par la casse (macOS/Windows).

## Accessibilité et responsive

- Texte sur ivoire : `ink`, `espresso`, `terracotta-deep`, `sage-deep`, `stone-deep` uniquement.
  `terracotta`, `sage`, `gold`, `stone` = décor.
- Cibles tactiles ≥ 44 px (`min-h-11`), labels sur tous les champs, focus visible, un seul `h1` par page.
- Vérifier 360, 390, 768, 1024 et 1440 px sans défilement horizontal.
