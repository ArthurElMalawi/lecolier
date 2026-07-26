# Documentation Données

Il n'y a **pas de backend** : ni base de données, ni ORM, ni API. Prisma/PostgreSQL a été retiré
(le catalogue n'était pas exploité côté base). Toutes les données vivent dans des modules
TypeScript lus par les Server Components.

## Références produit

### `lib/product-refs.ts` — source de vérité
Table générée depuis `lsiting_articles_complet.xlsx`. **Ne pas éditer à la main.**

Clé : `grammage|cover|format|variant|ruling|couleur|pages`

- `cover` : `PP`, `CARTONNE`
- `format` : `F17x22`, `F21x29_7`, `F24x32`
- `variant` : `STD`, `TP`, `MAT`, `DESSIN`
- `ruling` : `SEYES`, `QUADRI`, `LIGNE`, `BLANC`

Accès : `availableFor({ grammageGsm, cover, format, variant, ruling })` renvoie les coloris et
paginations disponibles ; `refFor({ …, color, pages })` renvoie le SKU. `COLOR_ORDER` fixe l'ordre
canonique des coloris, repris partout (lignes de tableau comme ordre des visuels).

### `lib/usage-sheets.ts` — tableaux dérivés
Construit les fiches des usages **Travaux Pratiques**, **Dessin & Musique**, **Maternelle** à partir
de `product-refs`. Chacun de ces produits est présenté à deux endroits — une page par gamme
(`gamme-polypro-premium/<usage>`, `gamme-polypro-classique/<usage>`) et une page qui réunit les deux
(`cahiers-specialises/<usage>`) — donc les deux dérivent de la même source et ne peuvent pas diverger.

- `SPECS` associe chaque page à ses sections : un titre éditorial (repris du catalogue papier) et une
  `Source` (`{ grammage, variant, ruling, layout? }`).
- `layout: "formats-en-colonnes"` transpose le tableau quand une seule pagination existe par produit.
- `groupedPages(path)` expose les pages réunies par une page « Cahiers Spécialisés » : elle en
  affiche les tableaux, donc aussi les visuels.
- `sheetFor(chemin, slug)` est le point d'entrée des pages : usage dérivé, sinon fiche manuelle.
- `COMPLEMENTS` liste les références **absentes de l'export Excel** alors qu'elles existent au
  catalogue (48319, 48324, 48314). À réintégrer à la source, après quoi le bloc peut être vidé.

### `lib/classement-refs.ts` — fiches saisies à la main
Produits « hors cahier » : feuillets mobiles, copies doubles, protège-cahiers, spiralés, blocs,
gourdes, sacs kraft, gamme plume. Une fiche = plusieurs sections, chacune avec son titre et son
tableau (`RefTableData` : colonnes bilingues + lignes `{ color?, label?, cells }`).

Clés : chemin complet (`nos-cahiers/…/x`) ou slug simple quand il est unique dans l'arbre.

## Arborescence

`lib/navigation.ts` décrit tout le catalogue (`navTree`) : rubriques, sous-catégories, gammes, fiches.
Le même arbre alimente le méga-menu, le tiroir mobile, les sections d'accueil et `/c/[...slug]`.
Champs notables : `family` (renvoie vers `product-refs`), `soon`, `icon`, `desc`, `phare`.

## Visuels

`lib/catalogue-images.generated.ts` — manifeste généré par `npm run images`, jamais édité à la main.
`lib/catalogue-images.ts` en expose la lecture. Voir [FRONTEND.md](./FRONTEND.md#visuels-produit).
