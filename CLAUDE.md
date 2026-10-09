# Maison Aria — instructions projet

Projet **personnel de démonstration** (portfolio) : **Maison Aria**, boutique fictive de mobilier,
décoration et aménagement intérieur — boutique, panier, réservation de consultations, assistant
ARIA Concierge simulé, espace client et tableau de bord simulés.

## Stack

- Vite + React 19, **JavaScript** (pas de TypeScript), React Router 8 (`react-router`, pas `react-router-dom`),
  Tailwind CSS v4, ESLint. Pas de Next.js.
- `@anthropic-ai/sdk` : uniquement côté serveur (`server/`, `api/`), jamais importé depuis `src/`.
- Aucune autre dépendance. Toute nouvelle dépendance doit être justifiée (utilité, coût, risques) et validée.

## Commandes

- `npm run dev` · `npm run build` · `npm run preview` · `npm run lint` · `npm test` · `npm run test:e2e`
- **Après chaque étape : `npm run build`, `npm run lint` et `npm test`** ; avant une publication : `npm run test:e2e`.
- `npm test` = tests unitaires `node:test` (`tests/*.test.js`). `npm run test:e2e` = Firefox piloté (`tests/e2e/`, Firefox requis).

## Architecture

- `src/app/` : `routes.js` (seule source des chemins — jamais d'URL en dur), `router.jsx`, `brand.js` (marque et mentions démo).
- `src/pages/` : une page par route ; assemble, sans logique métier.
- `src/features/<domaine>/` : composants, hooks et logique d'une fonctionnalité (products, cart, booking, concierge, account, admin, home).
- Logique **pure** (sans React) : `cartLogic.js`, `productFiltering.js`, `availability.js`, `time.js`,
  `lib/recommendationEngine.js`, `dashboardStats.js`.
- `src/services/` : seuls points d'accès aux données (asynchrones). Les pages n'importent pas `src/data/` pour les données métier.
- ARIA : `services/conciergeService.js` (point d'entrée, repli automatique) → fournisseurs `services/aria/remoteProvider.js`
  (IA via `api/concierge.js` + `server/ariaConcierge.js`) ou `simulatedProvider.js` → garde-fou `responseGuard.js`
  (appliqué côté serveur ET navigateur). Mode IA seulement si `ANTHROPIC_API_KEY` est définie côté serveur ;
  la démo publique est en **mode simulé**. L'interface doit toujours afficher le mode qui a répondu.
- `src/data/` : données fictives ; **toutes les images déclarées dans `data/images.js`**, fichiers locaux
  WebP dans `public/images/` (sources dans `public/images/CREDITS.md`).
- `src/components/ui|layout` : composants génériques.
- État partagé : `lib/createStore.js` + `lib/useStore.js` (localStorage versionné, validé, synchro entre onglets).

## Règles métier

- Prix en **centimes** (entiers).
- Dates stockées en ISO UTC, affichées en heure de Paris (`features/booking/time.js`).
- Créneaux **calculés**, jamais stockés. Chevauchement : `a.start < b.end && b.start < a.end`.
- `bookingService.createBooking` : idempotence (`requestId`) + **deuxième vérification** sans `await` entre lecture et écriture.
- ARIA ne recommande que des produits du catalogue ; garder `guardConciergeResponse` sur toute réponse.
- ARIA ne réserve, ne paie et ne décide jamais d'une disponibilité : elle suggère seulement.

## Contraintes

- Toujours afficher « Projet personnel de démonstration — Maison Aria » (bandeau + pied de page).
  Ne jamais présenter le projet comme un vrai client ou une vraie entreprise.
- Statistiques : toujours marquées « Données de démonstration » ; jamais de chiffre présenté comme réel.
- Aucun paiement, base de données, authentification ni email réels. IA réelle uniquement via le serveur, si une clé est configurée.
- `src/data/*.js` et `responseGuard.js` sont importés par Node (serveur) : imports avec extension `.js`.
- Aucun secret dans le code ; variables d'environnement via `.env` (non versionné) + `.env.example`.
- Images : uniquement via `data/images.js`, avec `alt` descriptif ; pas de personnes identifiables ni de marques.
- Clé d'IA ou de paiement : jamais dans React ni dans une variable `VITE_…` ; uniquement côté serveur.
- Déploiement : Vercel (`vercel.json` réécrit toutes les URL sauf `/api/` vers `index.html`).

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
