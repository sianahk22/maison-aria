# AURA Studio — instructions projet

Application web **de démonstration** (portfolio) pour une marque fictive de soins et bien-être :
boutique, réservation de consultations, assistant IA simulé, espace cliente, dashboard admin.

## Stack

- Vite + React 19, **JavaScript** (pas de TypeScript), React Router, Tailwind CSS v4, ESLint.
- Chemins des pages : uniquement via `ROUTES` (`src/app/routes.js`), jamais écrits en dur.
- Pas de Next.js pour le MVP.
- Toute nouvelle dépendance doit être justifiée (utilité, coût, risques) et validée avant installation.

## Commandes

- `npm run dev` : serveur de développement
- `npm run build` : build de production — **à lancer après chaque étape**
- `npm run lint` : vérification ESLint

## Architecture (couches)

- `src/pages/` : une page par route ; assemble des composants, pas de logique métier.
- `src/features/<domaine>/` : composants et hooks propres à une fonctionnalité.
- `src/components/ui/` : composants génériques réutilisables (Button, Card…).
- `src/components/layout/` : Header, Footer, bandeau démo.
- `src/domain/` : logique métier **pure** (pas de React) — créneaux, chevauchements, totaux, scoring.
- `src/services/` : accès aux données via des fonctions asynchrones ; `services/mock/` = implémentation locale.
  Les pages n'importent jamais directement `src/data/`, elles passent par les services.
- `src/data/` : données fictives de démonstration.
- `src/lib/` : utilitaires (formatage prix/dates, stockage local).
- `src/styles/index.css` : tokens de design (`@theme`).

## Règles métier

- Prix en **centimes** (entiers), jamais en décimaux.
- Dates stockées en ISO UTC, affichées en heure de Paris.
- Les créneaux disponibles sont **calculés**, jamais stockés.
- Chevauchement : `a.start < b.end && b.start < a.end`. Revérifier au moment de confirmer une réservation.
- Le Concierge ne recommande que des produits existant dans le catalogue.

## Contraintes

- Toujours indiquer qu'AURA Studio est un **projet de démonstration** (bandeau + pied de page).
- Aucune vraie API IA, paiement, base de données, authentification ni email dans le MVP.
- Aucun secret dans le code ; variables d'environnement via `.env` (non versionné) + `.env.example`.
- Accessibilité : texte sur ivoire en `charcoal`, `terracotta-deep` ou `sage-deep` uniquement
  (`terracotta`, `sage`, `gold` sont décoratifs : contraste insuffisant pour le texte).
- Responsive mobile d'abord (dès 360 px).
