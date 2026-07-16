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
- Trouver les revendeurs sur une carte interactive avec une liste filtrable (section frontend en veille pour le moment, liste codée en dur).
- Consulter les pages en français ou en anglais via un sélecteur `?lang=`.

## Points notables

- **Arborescence data-driven, source unique.** `lib/navigation.ts` décrit tout le catalogue (`navTree`) ; le même arbre alimente le méga-menu, le tiroir mobile, les sections de la page d'accueil et les pages `/c/[...slug]`. Remodeler la taxonomie = éditer un seul fichier.
- **Deux sources de références produit, pilotées par les images.** Les cahiers dérivent couleurs, nombres de pages et SKU de `lib/product-refs.ts` (map transcrite des visuels du catalogue) via `availableFor()` / `refFor()`. Les produits « hors cahier » (feuillets mobiles, copies doubles, gamme plume, usages 70g/90g…) portent leurs tableaux dans `lib/classement-refs.ts` (saisi à la main, vérifié contre les visuels). Les valeurs de référence font foi d'après les images (`img-v1`), pas d'un ancien seed.
- **Familles et formats calculés dans le code.** `lib/catalog.ts` (`familyKey` / `familyLabel` / `parseFamilyKey`, types dans `lib/catalog-types.ts`) dérive familles, formats et grille de disponibilité à partir des slugs et des références. Les colonnes/lignes entièrement vides sont masquées dans les tableaux (`components/ref-table.tsx`, avec pastilles de couleur).
- **i18n maison via un paramètre d'URL `?lang=`.** Un dictionnaire écrit à la main dans `lib/i18n.ts` plutôt qu'une librairie ou un routage par locale — les Server Components lisent `getLang(searchParams)` et transmettent le dictionnaire ; les liens conservent le paramètre manuellement.
- **Rendu 100 % statique, sans back.** Les pages de route sont des Server Components `async` qui lisent des données en mémoire (aucun appel réseau à une base) ; l'interactivité est confinée à de petits îlots client (la carte, la navigation du menu, le sélecteur de langue).

## Lancer en local

Nécessite seulement Node. Aucune base de données, aucune variable d'environnement requise.

```bash
npm install                   # http://localhost:3000
npm run dev
```

Autres scripts : `npm run build`, `npm start`, `npm run lint`.

Vérifié : `npm install`, `npm run build` et `npm run lint` réussissent sur un clone neuf.

## État

En cours de développement. Reste à faire :

- **Back à refaire quand nécessaire** : Prisma/PostgreSQL a été retiré (catalogue inexploité côté base). À reconstruire le jour où l'on aura besoin d'un back (commandes, stock, revendeurs dynamiques).
- **Section revendeurs en veille** : `ResellerSection` est commentée dans `app/page.tsx` ; elle lit une liste codée en dur dans `components/reseller-section.tsx`.
- **Visuels produit** : les fiches affichent un placeholder (« Visuel à venir ») via `ProductImage` tant que les images ne sont pas fournies ; le champ `image?` de l'arborescence est câblé mais non encore renseigné.
- **Catégories « Bientôt disponible »** : de nombreuses feuilles de `navTree` sont marquées `soon` (fournitures, accessoires, achats par niveau) en attendant leurs produits.
- Placeholder `docs/screenshot.png` à capturer.
