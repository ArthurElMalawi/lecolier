# Documentation Frontend

## Architecture
Le projet utilise le **Next.js App Router**. L'interface est construite avec React et stylisée avec Tailwind CSS.

## Pages
- **Accueil (`app/page.tsx`) :**
    - Section Hero (`components/hero.tsx`) : Présentation de la marque avec appel à l'action.
    - Sections de catégories dérivées de `navTree` (aucun appel base : tout est en mémoire).
    - Section des revendeurs (`ResellerSection`) avec carte interactive — actuellement commentée.
- **Catalogue (`app/c/[...slug]/page.tsx`) :** route unique de toute l'arborescence. Selon le nœud :
    - une **fiche produit** (`ProductSheet`) si le chemin a une fiche de références ou des visuels ;
    - une **grille de catégories** (`CategoryCard`) s'il a des enfants ;
    - une **liste de formats** si le nœud porte une `family` (page de gamme) ;
    - un bloc « Bientôt disponible » sinon.
- **Détail Produit (`app/product/[slug]/page.tsx`) :**
    - Fiche d'un cahier pour un format donné, slug `cahier-{grammage}g-{cover}-{format}[-5x5]`.
    - Références dérivées de `lib/product-refs.ts` (couleur × pagination).
- **Recherche (`app/recherche/page.tsx`) :** résultats de `?q=`, rendus côté serveur.
- **Qui sommes-nous (`app/qui-sommes-nous/page.tsx`) :**
    - Présentation de l'histoire, des valeurs et de la mission de la marque.
- **Nous contacter (`app/nous-contacter/page.tsx`) :** formulaire posté sur `app/api/contact/route.ts`.

## Composants Clés
- **`components/product-sheet.tsx` :**
    - Mise en page commune à **toutes** les fiches : fil d'ariane, visuel à gauche, titre et sections
      de tableaux à droite. Le titre de section est omis s'il est vide.
    - `note` s'affiche à la place des tableaux quand la fiche n'a pas encore de références.
- **`components/ref-table.tsx` :**
    - Tableau de références normalisé. Les colonnes et lignes entièrement vides sont masquées.
    - Les couleurs sont **toujours** rendues en pastille avec infobulle, jamais en toutes lettres
      (`COLOR_STYLE` / `colorLabel` de `lib/colors.ts`).
- **`components/search-bar.tsx` / `components/search-result.tsx` :**
    - Champ de recherche (en-tête desktop, haut du tiroir mobile) et ligne de résultat partagée
      entre les suggestions et la page `/recherche`. Voir « Recherche » plus bas.
- **`components/product-carousel.tsx` :**
    - Carrousel des visuels d'une fiche : flèches (écran large uniquement), bande de vignettes,
      compteur, légende, clavier ←/→ et balayage tactile.
    - Reprend le placeholder de `ProductImage` (« Visuel à venir ») quand la page n'a pas de visuel.
- **`components/category-card.tsx` :**
    - Carte vers une sous-catégorie. Une catégorie marquée `soon` qui a des visuels n'est plus
      annoncée comme à venir.
- **`components/header.tsx` :**
    - En-tête fixe avec logo, barre de recherche, navigation et sélecteur de langue.
    - Design moderne avec effets de survol et transparence.
- **`components/hero.tsx` :**
    - Section d'introduction visuelle avec image et texte d'accroche.
    - Bouton d'appel à l'action avec défilement fluide vers les produits.
    - Animation de survol (scale, shadow) sur les boutons.
- **`components/footer.tsx` :**
    - Pied de page structuré en 3 colonnes (Identité, Navigation, Réseaux sociaux).
    - Liens vers les mentions légales et politique de confidentialité.
- **`components/reseller-section.tsx` :**
    - Gère l'affichage combiné de la liste et de la carte.
    - Contient la logique de recherche (filtrage local).
    - Charge dynamiquement `MapView` pour éviter les erreurs SSR (Leaflet nécessite `window`).
- **`components/map-view.tsx` :**
    - Composant carte utilisant `react-leaflet`.
    - Affiche les marqueurs des revendeurs.
    - Gère le zoom et le centrage.
- **`components/ui/` :**
    - Composants de base (Card, Button, Breadcrumb, etc.) inspirés de shadcn/ui.
    - `Button` : Ajout de `cursor-pointer` par défaut.

## Internationalisation (i18n)
- **Fichier :** `lib/i18n.ts`
- **Mécanisme :**
    - Pas de routing i18n complexe (ex: `/en/product`).
    - Utilise un query param `lang` (`?lang=en`).
    - La fonction `getLang(searchParams)` extrait la langue.
    - La fonction `getDictionary(lang)` renvoie l'objet de traduction typé.

## Styling
- **Tailwind CSS 4 :** Configuration via CSS direct ou `postcss.config.mjs`.
- **Thème :** Utilisation de variables CSS pour les couleurs (background, foreground, etc.) définies dans `app/globals.css`.
- **Responsive :** Design mobile-first avec breakpoints standard Tailwind (`sm`, `lg`, etc.).
- **Container :** Standardisation de la largeur maximale (`max-w-7xl`) pour l'ensemble des sections (Header, Hero, Contenu principal, Footer).
- **Scroll Smooth :** Activé globalement dans `globals.css` pour une navigation fluide.

## Visuels produit

### Chaîne d'ingestion
Les photos sont déposées dans `C:\Users\arthu\Pictures\lecolier\catalogue-v1`, dont l'arborescence
**reproduit celle du menu**, avec un niveau optionnel de « variante » sous la page produit :

```
nos-cahiers/gamme-polypro-premium/cahiers/17x22/*.png        -> variante « 17x22 »
nos-cahiers/gamme-polypro-premium/cahiers/toutes-tailles/*   -> commun à toute la gamme
nos-cahiers/gamme-polypro-classique/cahiers/24x32-5x5/*      -> variante « 24x32-5x5 »
fournitures/classement/copies-doubles/*.png                  -> commun (pas de variante)
```

`npm run images` (`scripts/ingest-catalogue-images.mts`) convertit tout en webp ≤ 1400 px dans
`public/catalogue/`, régénère `lib/catalogue-images.generated.ts` et déduit une légende bilingue du
nom de fichier (`…170x220_bleu_48P.png` → « 17 × 22 cm · Bleu · 48 pages » ; `Page de garde`,
`Réglure`, `5 couleurs`, `Perforated`, `5x5` sont reconnus). Le dossier de sortie et le manifeste sont
**entièrement régénérés** à chaque exécution : ajouter des images puis relancer suffit.

Les sources (PNG pleine résolution) restent **hors dépôt** ; seuls les webp générés sont versionnés.
Un lot livré « à plat », avec des dossiers nommés en libellés plutôt qu'en slugs, se recopie avec
`scripts/copy-photo-batch.ps1 -Source "<dossier livré>"` (simulation par défaut, `-Execute` pour
copier ; rien n'est écrasé).

### Placement d'un visuel
Trois régimes, du plus précis au plus tolérant :

1. **Nom = numéro de référence** (`44519.png`) — le fichier n'a pas besoin d'être rangé finement :
   sa page est celle **dont la fiche affiche cette référence**, et sa taille, son coloris et sa
   pagination viennent de `attributesFor()` (`lib/product-refs.ts`). Les pages de gamme
   (« Cahiers ») n'ayant pas de fiche, elles sont retrouvées par grammage + couverture, et l'usage
   (TP, Dessin & Musique, Maternelle) par la variante et la réglure de la référence. Une référence
   absente de l'export, ou portée par deux clés contradictoires, n'est **pas** placée au hasard :
   elle est listée en fin d'exécution.
2. **Nom en clair à la racine d'une gamme** — réglures, pages de garde et pictogrammes valent pour
   toutes les tailles : leur usage et leur portée se lisent dans le nom (`NAME_RULES`).
3. **Sinon le dossier fait foi**, convention historique. Un visuel déjà rangé sous une page d'usage
   garde donc sa place.

### Lecture (`lib/catalogue-images.ts`)
- `imagesFor(chemin, variante?)` — ordonne par **type de vue** (`rank`, posé à l'ingestion), pas par
  portée : toutes les couvertures ouvrent le carrousel, les détails (page de garde, réglure) le
  ferment, qu'ils soient communs à la gamme ou propres à une taille. À type égal, les visuels
  restent groupés par taille, dans l'ordre canonique des coloris.
- Une variante `toutes-tailles-<réglure>` ne s'applique qu'aux produits de cette réglure :
  `toutes-tailles-seyes` n'apparaît pas sur une page 5×5. `toutes-tailles` (sans suffixe) vaut pour tout.
- `imagesForPages([…])` — une page qui en regroupe d'autres réunit leurs visuels (voir `groupedPages`).
- `heroFor(chemin, variante)` — vignette d'une carte de format : son premier visuel, à défaut un commun.
- `hasImages(chemin)` — utilisé par `CategoryCard` pour lever l'étiquette « Bientôt disponible ».

## Recherche

### Index (`lib/search-index.ts`)
Construit **une fois au chargement du module**, à partir des mêmes sources que les pages : rien n'y
est saisi à la main. Une entrée = une page réellement atteignable, avec les références qu'elle
affiche — chercher un SKU renvoie donc toujours vers une page qui le montre.

- chaque nœud de `navTree` (avec les références de sa fiche, via `sheetFor`) ;
- les fiches format d'une gamme (`/product/…`), sauf si la gamme a sa propre fiche — c'est la
  règle qu'applique `/c/[...slug]` (cf. Gamme Plume, qui présente tous ses formats en un tableau).

`searchCatalogue(q, lang, limite)` accepte :
- un **numéro de référence** : égalité, puis début, puis fragment. En dessous de `MIN_REF_DIGITS`
  chiffres (`lib/search-query.ts`), la requête désignerait la moitié du catalogue : l'interface le dit
  (« saisissez au moins 3 chiffres ») plutôt que d'afficher un « aucun résultat » trompeur ;
- des **mots** : confrontés au titre de la page puis à son fil d'ariane, tous doivent correspondre.
  Accents et ponctuation sont ignorés, et « 17x22 » retrouve « 17 x 22 cm ».

### Interface
`SearchBar` interroge `app/api/search/route.ts` au fil de la frappe (délai de 180 ms) : l'index reste
côté serveur plutôt que d'alourdir le bundle client de tout le catalogue. Entrée sans sélection ouvre
`/recherche`, qui appelle `searchCatalogue` directement. Deux présentations, une seule ligne de
résultat (`SearchResultRow`) : surcouche sous le champ en en-tête, dans le flux dans le tiroir mobile
(le conteneur y défile).

## Assets
- Visuels produit générés : `public/catalogue/` (ne pas éditer, voir ci-dessus).
- Anciens placeholders : `public/products/`.
- Le logo et autres icônes sont à la racine de `public/`.
