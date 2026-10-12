# Maison Aria — textes pour le portfolio

> Textes prêts à copier dans la section « Projets » du portfolio. Ne pas modifier le sens des
> mentions « projet personnel » et « marque fictive ».

## Accroche

**Projet personnel de démonstration — plateforme e-commerce, réservation et assistant intelligent pour
une marque fictive de décoration intérieure.**

## Description courte (≈ 300 caractères)

Maison Aria est une application web de démonstration pour une marque fictive de mobilier : boutique
filtrable, panier persistant, réservation de consultations avec prévention des doubles réservations,
assistant de recommandation simulé et tableau de bord. React 19, Vite, Tailwind CSS.

## Description longue

Maison Aria est un projet personnel conçu pour illustrer une prestation complète pour une marque
premium de décoration intérieure — fictive. L'objectif : montrer comment une même application peut
réunir une boutique en ligne, un service de prise de rendez-vous et un assistant de conseil, avec une
expérience éditoriale soignée sur mobile comme sur ordinateur.

La réservation est le cœur technique du projet : les créneaux sont calculés à partir des horaires des
consultants, en tenant compte du fuseau de Paris et des changements d'heure. Les doubles réservations
sont empêchées à plusieurs niveaux — bouton bloqué pendant l'envoi, clé d'idempotence contre le
double-clic, et seconde vérification de disponibilité au moment de confirmer, démontrable dans
l'interface grâce à un mode « réservation concurrente ».

ARIA Concierge, l'assistant, dispose de deux modes. Sur la démo publique, il fonctionne en mode simulé :
un moteur de règles analyse la demande et recommande uniquement des produits existants, en expliquant
pourquoi. Une fonction serverless permet d'activer Claude (Anthropic) dès qu'une clé est configurée :
la clé reste côté serveur, la réponse est contrainte par un schéma JSON limité au catalogue, un
garde-fou la revérifie, et l'IA ne peut jamais décider seule d'une réservation ou d'un paiement.

Le projet est accessible (navigation clavier, contrastes vérifiés, formulaires libellés), testé
(38 tests unitaires et 49 vérifications de bout en bout dans un navigateur, à cinq largeurs d'écran)
et documenté. Toutes les limites sont assumées : pas de paiement, d'authentification ni de base de
données réels dans cette version.

## Fonctionnalités

- Boutique de 19 produits fictifs : recherche, filtres catégorie et prix, tri, fiches détaillées,
  produits similaires
- Panier persistant (ajout, quantités, suppression, totaux) et écran de commande de démonstration
- Réservation de consultations : 4 services, 3 consultants fictifs, visio ou boutique, calendrier,
  récapitulatif, confirmation, modification et annulation
- Prévention des doubles réservations : idempotence, verrou anti double-clic, seconde vérification
- ARIA Concierge : conversation, questions rapides, recommandations expliquées, renvoi vers un conseiller ;
  mode simulé et intégration Claude (Anthropic) côté serveur, activable par variable d'environnement
- Espace client de démonstration et tableau de bord (indicateurs, calendrier, demandes, commandes)
- Design responsive premium, accessibilité WCAG AA, images optimisées, déploiement Vercel

## Technologies

React 19 · Vite 8 · React Router 8 · Tailwind CSS 4 · JavaScript (ES2024) · Vercel Functions ·
SDK Anthropic (Claude, sorties JSON structurées) · ESLint · node:test · WebDriver BiDi (tests
navigateur) · API Intl (fuseaux horaires) · localStorage

## Limites honnêtes

- Démonstration : marque, produits, consultants et chiffres sont fictifs.
- Aucun paiement réel, aucune authentification, aucun email envoyé.
- Démo publique en mode simulé (règles) : l'intégration Claude est prête et testée avec un faux
  client, mais n'est pas activée (aucune clé configurée).
- Données stockées dans le navigateur : la prévention des doublons est démontrée, mais seule une base
  de données côté serveur la garantirait entre plusieurs utilisateurs.
- Photos d'illustration (Unsplash), à remplacer avant tout usage commercial.

## Visuel et liens

- Image de couverture : [`docs/cover.jpg`](cover.jpg) (1440 × 900) — version partage : `public/og-cover.jpg` (1200 × 630)
- Démo en ligne : https://maison-aria.vercel.app
- Code source : https://github.com/sianahk22/maison-aria

## Texte prêt à intégrer (section Projets)

> **Maison Aria**
> *Projet personnel de démonstration — plateforme e-commerce, réservation et assistant intelligent
> pour une marque fictive de décoration intérieure.*
>
> Boutique filtrable, panier persistant, réservation de consultations avec prévention des doubles
> réservations (idempotence et seconde vérification), assistant de recommandation ARIA (mode simulé
> en démo, intégration Claude côté serveur prête) avec garde-fou anti-hallucination, espace client et
> tableau de bord. Conçu mobile d'abord, accessible et testé.
>
> **Stack :** React 19, Vite, React Router, Tailwind CSS, Vercel Functions, SDK Anthropic, node:test.
> [Voir la démo](https://maison-aria.vercel.app) · [Voir le code](https://github.com/sianahk22/maison-aria)
