# Aura Studio — Maison Aria

> ⚠️ **Projet personnel de démonstration — Aura Studio.**
> Maison Aria est une **marque fictive**. Produits, prix, consultants, réservations et statistiques sont
> inventés. Aucun produit n'est vendu, aucun paiement n'est effectué, aucun rendez-vous réel n'est créé,
> aucune IA n'est connectée. Ce projet ne représente aucun client ni aucune entreprise réelle.

Application web d'une boutique premium de mobilier, décoration et aménagement intérieur, réalisée
pour démontrer une architecture frontend propre : boutique, panier, réservation de consultations
avec prévention des doubles réservations, assistant de recommandation, espace client et tableau de bord.

## Fonctionnalités

| Page | Route | Ce qu'elle montre |
| --- | --- | --- |
| Accueil | `/` | Hero éditorial, carte flottante « prochain créneau » calculée en direct, sélection, services, aperçus consultation et assistant, prochains créneaux |
| Collection | `/shop` | Recherche, filtres catégorie et prix, tri — filtres conservés dans l'URL (partageables) |
| Fiche produit | `/shop/:productId` | Galerie, dimensions, matériaux, délai indicatif, disponibilité, quantité, produits similaires, lien vers l'assistant |
| Panier | `/cart` | Ajout, quantité, suppression, sous-total, livraison, total, persistance `localStorage`, écran de commande de démonstration |
| Réservation | `/booking` | Type, consultant·e, format, date, heure, coordonnées, récapitulatif, confirmation, modification |
| ARIA Concierge | `/concierge` | Conversation, suggestions rapides, « réflexion » simulée, recommandations expliquées, renvoi vers un conseiller |
| Espace client | `/account` | Rendez-vous à venir (modifier / annuler), historique, commandes fictives, recommandations |
| Tableau de bord | `/admin` | Indicateurs, prochaines consultations, statuts, calendrier 7 jours, produits consultés, demandes à ARIA, dernières réservations |
| 404 | `/404` et toute URL inconnue | Page introuvable |

### Règles de réservation

- Les créneaux sont **calculés** à partir des horaires des consultants, jamais stockés.
- Aucun créneau dans le passé ni à moins de 2 h ; créneaux déjà réservés affichés barrés et non sélectionnables.
- Deux intervalles se chevauchent si `début A < fin B` **et** `début B < fin A`.
- **Double-clic** : bouton désactivé pendant l'envoi + verrou synchrone + **clé d'idempotence** (la même
  demande envoyée deux fois ne crée qu'une réservation).
- **Deuxième vérification obligatoire** au moment de confirmer : un créneau peut être pris entre son
  affichage et la confirmation. Un bouton « Simuler une réservation concurrente » permet de le démontrer.
- Un même client ne peut pas avoir deux rendez-vous qui se chevauchent.
- Fuseau Europe/Paris géré avec l'API `Intl` (changements d'heure été/hiver inclus) ; stockage en UTC.

### ARIA Concierge (assistant simulé)

`src/lib/recommendationEngine.js` analyse des mots-clés (type de meuble, style, ambiance, taille,
matière, pièce, budget), note les produits du catalogue et renvoie les meilleurs **avec la raison** du
choix. Il ne peut recommander que des produits existants ; le service revérifie chaque identifiant.

## Technologies

| Outil | Rôle |
| --- | --- |
| [Vite](https://vite.dev) 8 | Serveur de développement et build |
| React 19 | Interface (`use`, `Suspense`, `useSyncExternalStore`, `<title>` natif) |
| React Router 8 | Navigation, pages chargées à la demande |
| Tailwind CSS 4 | Styles et tokens de design |
| ESLint 10 | Qualité du code (règles React Hooks incluses) |

Aucune autre dépendance : pas de bibliothèque d'état, de dates, d'icônes ni de graphiques.
Ces besoins sont couverts par de petits modules maison documentés.

> `react-router-dom` n'est pas installé : depuis la version 7, c'est un simple alias de `react-router`,
> qui est utilisé directement ici.

## Lancement local

Prérequis : **Node.js 22.22 ou plus récent** (exigé par React Router 8 ; testé avec Node 24).

```bash
npm install      # installe les dépendances
npm run dev      # lance le site sur http://localhost:5173
```

### Commandes

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement avec rechargement à chaud |
| `npm run build` | Build de production dans `dist/` |
| `npm run preview` | Sert le build de production localement |
| `npm run lint` | Vérification ESLint |

Il n'y a **pas encore de commande `npm test`** (voir « Prochaines évolutions »).

## Architecture

```
src/
├── app/            # routeur, chemins (ROUTES), identité de marque et mentions de démo
├── pages/          # une page par route : assemble des composants, sans logique métier
├── features/       # code par fonctionnalité
│   ├── products/   #   cartes, filtres (logique pure : productFiltering.js), galerie
│   ├── cart/       #   logique pure (cartLogic.js), store, lignes, modale de commande
│   ├── booking/    #   créneaux et conflits (availability.js), fuseau (time.js), formulaire
│   ├── concierge/  #   conversation, cartes de recommandation, journal local
│   ├── account/    #   carte de rendez-vous (modifier / annuler)
│   ├── admin/      #   calculs du tableau de bord (dashboardStats.js), widgets
│   └── home/       #   sections de la page d'accueil
├── components/     # composants génériques : ui/ (Button, Modal, Field…) et layout/ (Header, Footer…)
├── services/       # accès aux données : seul point à remplacer pour une vraie API
├── data/           # données fictives : produits, images, consultations, statistiques
├── lib/            # utilitaires : store, formatage, images, moteur de recommandation
└── styles/         # tokens de design (@theme Tailwind)
```

**Séparation des responsabilités**

- **Logique pure** (sans React) : `cartLogic`, `productFiltering`, `availability`, `time`,
  `recommendationEngine`, `dashboardStats` — faciles à tester et à réutiliser côté serveur.
- **Services** asynchrones : `productService`, `bookingService`, `conciergeService`. Ils simulent la
  latence réseau. Pour passer en production, on remplace leur contenu par des appels HTTP sans toucher
  aux pages (des commentaires dans chaque fichier indiquent comment).
- **État partagé** : `lib/createStore.js` (≈ 60 lignes) + `useSyncExternalStore`, avec persistance
  `localStorage`, validation des données relues et synchronisation entre onglets.

## Images

- Toutes les URL sont centralisées dans **`src/data/images.js`**, avec un texte alternatif décrivant
  ce qu'on voit réellement.
- Ce sont des **photos d'illustration Unsplash** (licence Unsplash), servies en taille adaptée à
  l'écran (`srcset`) et chargées à la demande (`loading="lazy"`). Elles **ne représentent pas de vrais
  produits** et **doivent être remplacées par des images sous licence commerciale** avant tout usage
  commercial.
- Pour utiliser des images locales : les déposer dans **`public/images/`** et remplacer `id` par
  `src: '/images/fichier.webp'` (voir `public/images/README.md`).
- Si une image ne se charge pas, une **image de secours** (`public/images/placeholder.svg`) s'affiche.

## Accessibilité et responsive

- HTML sémantique, un seul `h1` par page, titres d'onglet par page, lien « Aller au contenu ».
- Formulaires libellés, erreurs reliées aux champs (`aria-invalid`, `aria-describedby`), alertes annoncées.
- Choix (catégories, créneaux, consultants) construits avec de vrais boutons radio : navigation aux flèches.
- Fenêtres modales natives `<dialog>` (focus piégé, touche Échap).
- Contrastes vérifiés (WCAG AA) : variantes foncées `terracotta-deep`, `sage-deep`, `stone-deep` pour
  le petit texte ; sauge, or et terracotta clairs réservés au décor.
- Respect du réglage « réduire les animations ».
- Vérifié sans défilement horizontal à 360, 390, 768, 1024 et 1440 px.

## Limites actuelles

- **Pas de vrai paiement** : « Passer à la commande » affiche un écran expliquant que le paiement n'est
  pas connecté. Aucune intégration Stripe.
- **Pas de vraie API d'IA** : ARIA fonctionne par règles locales ; elle ne comprend pas les phrases
  complexes ou ambiguës.
- **Pas d'authentification réelle** : l'espace client affiche un profil fictif ; « mes rendez-vous » sont
  ceux créés dans ce navigateur.
- **Pas de base de données** : tout est stocké dans le `localStorage` du navigateur. La prévention des
  doublons démontre la logique, mais seule une base côté serveur (contrainte d'unicité ou d'exclusion
  dans une transaction) la garantit entre plusieurs utilisateurs et appareils.
- **Aucun email** n'est envoyé.
- Application monopage : référencement (SEO) limité.
- Polices système (pas de police web dédiée).

## Prochaines évolutions

1. Tests automatisés : Vitest pour la logique pure (créneaux, panier, recommandations) et Playwright pour
   les parcours (réservation, panier).
2. Backend (fonctions serverless) + base PostgreSQL : catalogue, réservations avec contrainte anti-chevauchement.
3. Authentification (fournisseur reconnu) et espace client réel.
4. Paiement via un prestataire (ex. Stripe Checkout) appelé côté serveur.
5. ARIA connectée à un modèle d'IA via le serveur : clé en variable d'environnement, réponses JSON
   validées, filtrage des produits inconnus, limitation des coûts, gestion RGPD.
6. Emails de confirmation, images produits sous licence, police éditoriale auto-hébergée.

---

Projet personnel de démonstration — Aura Studio. Photos d'illustration : [Unsplash](https://unsplash.com).
