# AURA Studio

> ⚠️ **Projet de démonstration.** AURA Studio est une marque fictive créée pour un portfolio.
> Aucun produit n'est vendu, aucun paiement n'est effectué, aucune donnée réelle n'est collectée.

Plateforme premium de soins et bien-être combinant boutique en ligne, réservation de consultations,
recommandations assistées par IA (simulées), espace cliente et tableau de bord administrateur.

## Objectifs du projet

- Architecture frontend propre, séparant données, logique métier et interface.
- Composants réutilisables et design system basé sur des tokens.
- Logique de réservation avec prévention des doubles réservations.
- Interface d'assistant IA, prête à être branchée sur une vraie API.
- Accessibilité et responsive design.

## Stack technique

| Outil | Rôle |
| --- | --- |
| [Vite](https://vite.dev) | Serveur de développement et build |
| React 19 | Interface utilisateur |
| React Router | Navigation entre les pages |
| Tailwind CSS v4 | Styles et tokens de design |
| ESLint | Qualité du code |

## Démarrage

Prérequis : Node.js 20 ou plus récent.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de production dans dist/
npm run lint     # vérification du code
```

## Structure

```
src/
├── app/            # configuration de l'application (routeur, fournisseurs)
├── pages/          # une page par route
├── features/       # composants et hooks par fonctionnalité (catalogue, panier, réservation…)
├── components/     # composants génériques (ui/) et mise en page (layout/)
├── domain/         # logique métier pure, sans React (créneaux, totaux, recommandations)
├── services/       # accès aux données — implémentation locale dans mock/
├── data/           # données fictives de démonstration
├── lib/            # utilitaires
└── styles/         # tokens de design et styles globaux
```

Les composants n'accèdent jamais directement aux données : ils passent par des **services**.
Pour connecter plus tard une vraie API, une base de données ou un modèle d'IA, il suffira de fournir
une nouvelle implémentation de ces services, sans modifier les pages.

## Palette

| Token | Couleur | Usage |
| --- | --- | --- |
| `ivory` | `#F7F3EE` | Fond |
| `charcoal` | `#1E1D1A` | Texte principal |
| `terracotta` | `#B86E5B` | Accent décoratif |
| `terracotta-deep` | `#94503F` | Liens et texte d'accent (contraste AA) |
| `sage` | `#A9B5A0` | Accent décoratif |
| `sage-deep` | `#5E6B56` | Texte secondaire (contraste AA) |
| `gold` | `#C7A66A` | Détails décoratifs |
| `white` | `#FFFFFF` | Cartes et surfaces |

## Avancement

- [x] Étape 0 — socle technique (Vite, React, Tailwind, ESLint, structure)
- [x] Étape 1 — design system, mise en page et navigation
- [ ] Étape 2 — modèle de données, données de démo et services
- [ ] Étape 3 — boutique, filtres et fiche produit
- [ ] Étape 4 — panier
- [ ] Étape 5 — logique de réservation et tests
- [ ] Étape 6 — interface de réservation
- [ ] Étape 7 — espace cliente
- [ ] Étape 8 — AURA Concierge
- [ ] Étape 9 — tableau de bord administrateur
- [ ] Étape 10 — finitions (accessibilité, performances, documentation)

## Limites connues

- Les données sont stockées localement dans le navigateur : la prévention des doubles réservations
  démontre la logique, mais seule une base de données côté serveur peut la garantir entre plusieurs
  utilisateurs.
- L'assistant AURA Concierge est simulé par des règles. Il ne constitue pas un avis médical ou
  dermatologique.
