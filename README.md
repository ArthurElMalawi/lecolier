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
- **Deux sources de références produit, pilotées par les images.** Les cahiers dérivent couleurs, nombres de pages et SKU de `lib/product-refs.ts` (map transcrite des visuels du catalogue) via `availableFor()` / `refFor()`. Les produits « hors cahier » (feuillets mobiles, copies doubles, protège-cahiers, spiralés, blocs, gourdes, sacs kraft, gamme plume) portent leurs tableaux dans `lib/classement-refs.ts` (saisi à la main, vérifié contre les visuels). Les valeurs de référence font foi d'après les images, pas d'un ancien seed.
- **Un produit présenté à deux endroits ne peut pas diverger.** Les usages TP / Dessin & Musique / Maternelle existent en page par gamme *et* en page « Cahiers Spécialisés » qui réunit les deux. `lib/usage-sheets.ts` construit les neuf tableaux depuis `product-refs` : seuls les titres de section restent éditoriaux, et la page regroupante réunit aussi les visuels des pages qu'elle regroupe.
- **Visuels ingérés depuis un dossier calqué sur le menu.** `npm run images` lit `catalogue-v1/<chemin de la page>/<taille>/`, convertit en webp ≤ 1400 px vers `public/catalogue/`, déduit une légende bilingue du nom de fichier et régénère `lib/catalogue-images.generated.ts`. Une fiche montre les visuels communs à la gamme puis ceux de sa taille ; `toutes-tailles-seyes` ne s'applique qu'aux produits Seyès.
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
- **Visuels produit** : 16 pages sur 57 sont illustrées. Manquent notamment *Dessin & Musique* de la gamme classique, les *protège-cahiers*, et les photos propres au 24 × 32 classique et au 17 × 22 de la gamme Plume (qui n'affichent que des visuels de gamme). Déposer les fichiers puis relancer `npm run images`.
- **Références absentes de l'export Excel** : 48319, 48324 et 48314 sont déclarées dans `COMPLEMENTS` (`lib/usage-sheets.ts`) pour ne pas disparaître du site. À réintégrer dans `lsiting_articles_complet.xlsx`, ainsi que deux incohérences relevées : 44610 est typé 64 pages (le catalogue papier dit 60) et 44540 porte deux clés contradictoires.
- **Catégories « Bientôt disponible »** : de nombreuses feuilles de `navTree` sont marquées `soon` (fournitures, accessoires, achats par niveau) en attendant leurs produits. Une catégorie qui reçoit des visuels lève automatiquement l'étiquette.
- Placeholder `docs/screenshot.png` à capturer.
