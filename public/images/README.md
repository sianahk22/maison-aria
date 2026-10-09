# Images de Maison Aria

Toutes les images du site sont **locales** et déclarées dans `src/data/images.js`.

```
public/images/
├── products/   # <produit>-480.webp, <produit>-800.webp, <produit>-detail.webp (vue rapprochée)
├── scenes/     # images d'ambiance (accueil, consultation, assistant)
├── placeholder.svg   # image de secours si une photo ne se charge pas
└── CREDITS.md        # source et licence de chaque photo
```

## Remplacer une image

1. Préparer l'image au **format portrait 4:5** pour un produit (ex. 800 × 1000 px), en **WebP**.
2. L'enregistrer sous le **même nom** (`canape-lune-480.webp`, `canape-lune-800.webp`, `canape-lune-detail.webp`).
3. Mettre à jour le texte `alt` dans `src/data/images.js` pour décrire ce que montre la nouvelle image.
4. Lancer `npm test` : un test vérifie que chaque image déclarée existe bien.

⚠️ N'ajoutez que des images dont vous possédez les droits. Évitez les personnes identifiables et les
marques sans autorisation. Les photos actuelles sont des illustrations à remplacer avant tout usage
commercial (voir `CREDITS.md`).
