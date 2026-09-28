# lecolier

Catalogue produits et localisateur de revendeurs pour L'écolier, une marque française de cahiers scolaires — [lecolier.eu](https://www.lecolier.eu)

![lecolier](./docs/screenshot.png)

## Stack

Next.js 16.1.6 (App Router, React 19.2.3) · TypeScript 5 · Tailwind CSS v4 · Leaflet 1.9 / react-leaflet 5

Catalogue **entièrement statique** : aucune base de données ni back. Les données produit vivent dans des modules TypeScript (`lib/product-refs.ts`, `lib/classement-refs.ts`, `lib/navigation.ts`).

## Ce que ça fait

- Parcourir le catalogue via une arborescence à plusieurs niveaux : rubrique → sous-catégorie → gamme → fiche produit, exposée par la route dynamique `/c/[...slug]` avec fil d'ariane.
- Naviguer depuis un **méga-menu « Nos produits »** (desktop) ou un **tiroir mobile en drill-down** (on entre dans une catégorie, on remonte via « Retour »), tous deux pilotés par la même arborescence.
- Consulter des **fiches produit** présentant les **références (SKU)** par couleur × nombre de pages × réglure — la réglure est précisée dans le titre.
- Parcourir les **visuels de chaque produit** dans un carrousel (flèches, vignettes, balayage tactile), alimenté par un dossier d'images qui reproduit l'arborescence du menu.
- **Chercher un produit par son nom ou par son numéro de référence** depuis l'en-tête (ou le tiroir mobile), avec suggestions au fil de la frappe et page de résultats `/recherche`.
- Trouver les revendeurs sur une carte interactive avec une liste filtrable (section frontend en veille pour le moment, liste codée en dur).
- Consulter les pages en français ou en anglais via un sélecteur `?lang=`.

## Points notables

- **Arborescence data-driven, source unique.** `lib/navigation.ts` décrit tout le catalogue (`navTree`) ; le même arbre alimente le méga-menu, le tiroir mobile, les sections de la page d'accueil et les pages `/c/[...slug]`. Remodeler la taxonomie = éditer un seul fichier.
- **Trois sources de références produit, pilotées par les images.** Les cahiers dérivent couleurs, nombres de pages et SKU de `lib/product-refs.ts` (map transcrite des visuels du catalogue) via `availableFor()` / `refFor()`. Les produits « hors cahier » à déclinaison unique (feuillets mobiles, copies doubles, protège-cahiers, spiralés, blocs, gourdes, sacs kraft, gamme plume) portent leurs tableaux dans `lib/classement-refs.ts`. Les pages qui présentent **plusieurs produits distincts** (colle en bâton 10/20/40 g, ciseaux, trousses…) vivent dans `lib/product-lines.ts` : une ligne de produit = un carrousel + son tableau. Les trois sont saisies d'après les visuels et convergent vers `sheetFor()`, que lisent la recherche et l'ingestion des images.
- **Un produit présenté à deux endroits ne peut pas diverger.** Les usages TP / Dessin & Musique / Maternelle existent en page par gamme *et* en page « Cahiers Spécialisés » qui réunit les deux. `lib/usage-sheets.ts` construit les neuf tableaux depuis `product-refs` : seuls les titres de section restent éditoriaux, et la page regroupante réunit aussi les visuels des pages qu'elle regroupe.
- **Visuels ingérés depuis un dossier calqué sur le menu.** `npm run images` lit `catalogue-v1/<chemin de la page>/<taille>/`, convertit en webp ≤ 1400 px vers `public/catalogue/`, déduit une légende bilingue du nom de fichier et régénère `lib/catalogue-images.generated.ts`. Une fiche montre les visuels communs à la gamme puis ceux de sa taille ; `toutes-tailles-seyes` ne s'applique qu'aux produits Seyès.
- **Un visuel nommé par sa référence se range tout seul.** `44519.png` n'a pas besoin d'être classé : sa page est celle dont la fiche affiche cette référence, et sa taille, son coloris et sa pagination viennent de `lib/product-refs.ts`. Déposer le fichier à la racine de sa gamme suffit. Ce qui reste introuvable est listé en fin d'exécution plutôt que rangé au hasard.
- **Recherche sans index à maintenir.** `lib/search-index.ts` agrège l'arborescence, les références et les fiches en une liste de pages construite au chargement du module : rien n'y est saisi, un produit devient trouvable dès qu'il est ajouté à `navTree` ou à l'export Excel, et un SKU renvoie toujours vers une page qui l'affiche. L'index reste côté serveur — la barre interroge `/api/search` plutôt que d'embarquer le catalogue dans le bundle client.
- **Familles et formats calculés dans le code.** `lib/catalog.ts` (`familyKey` / `familyLabel` / `parseFamilyKey`, types dans `lib/catalog-types.ts`) dérive familles, formats et grille de disponibilité à partir des slugs et des références. Les colonnes/lignes entièrement vides sont masquées dans les tableaux (`components/ref-table.tsx`, avec pastilles de couleur).
- **i18n maison via un paramètre d'URL `?lang=`.** Un dictionnaire écrit à la main dans `lib/i18n.ts` plutôt qu'une librairie ou un routage par locale — les Server Components lisent `getLang(searchParams)` et transmettent le dictionnaire ; les liens conservent le paramètre manuellement.
- **Rendu 100 % statique, sans back.** Les pages de route sont des Server Components `async` qui lisent des données en mémoire (aucun appel réseau à une base) ; l'interactivité est confinée à de petits îlots client (la carte, la navigation du menu, le sélecteur de langue).

## Lancer en local

Nécessite seulement Node. Aucune base de données, aucune variable d'environnement requise.

```bash
npm install                   # http://localhost:3000
npm run dev
```

Autres scripts : `npm run build`, `npm start`, `npm run lint`, `npm run images` (ré-ingestion des visuels produit — voir [docs/FRONTEND.md](./docs/FRONTEND.md#visuels-produit)).

Pas de tests automatisés : la vérification passe par `npx tsc --noEmit`, `npm run lint` et `npm run build`.

## État

En cours de développement. Reste à faire :

- **Back à refaire quand nécessaire** : Prisma/PostgreSQL a été retiré (catalogue inexploité côté base). À reconstruire le jour où l'on aura besoin d'un back (commandes, stock, revendeurs dynamiques).
- **Section revendeurs en veille** : `ResellerSection` est commentée dans `app/page.tsx` ; elle lit une liste codée en dur dans `components/reseller-section.tsx`.
- **Visuels produit** : 18 pages sur 50 sont illustrées (370 visuels). Manquent notamment les *protège-cahiers*, les *feuillets mobiles* et les 26 lignes de produit de `lib/product-lines.ts` — leurs sous-dossiers existent déjà dans `catalogue-v1/` (un par carrousel, nommé comme le `variant`). Déposer les fichiers puis relancer `npm run images`.
- **44610 est typé 64 pages** dans l'export (`CAHIER TRAVAUX PRATIQUES … 17X22 64P`) alors que le catalogue papier dit 60. À trancher à la source.
- **Photos montrant un coloris sans référence** : « Sans réglure » et « Double lignes » en Orange, Bleu, Rouge et Vert (gamme Classique). Les désignations disent `ASSORTX4`, donc ce sont probablement les quatre coloris du lot assorti — à confirmer sur le catalogue papier avant d'en faire des lignes de tableau.
- **Catégories « Bientôt disponible »** : il reste `colle-blanche`, `colle-transparente` et `agenda-rentree`, marquées `soon` dans `navTree` faute de références. Une catégorie qui reçoit des visuels lève automatiquement l'étiquette.
- Placeholder `docs/screenshot.png` à capturer.
