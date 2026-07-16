# lecolier

Catalogue produits et localisateur de revendeurs pour L'écolier, une marque française de cahiers scolaires — [lecolier.eu](https://www.lecolier.eu)

![lecolier](./docs/screenshot.png)

## Stack

Next.js 16.1.6 (App Router, React 19.2.3) · TypeScript 5 · Tailwind CSS v4 · Prisma 7.3 sur PostgreSQL (`@prisma/adapter-pg`) · Leaflet 1.9 / react-leaflet 5

## Ce que ça fait

- Parcourir le catalogue via une arborescence à plusieurs niveaux : rubrique → sous-catégorie → gamme → fiche produit, exposée par la route dynamique `/c/[...slug]` avec fil d'ariane.
- Naviguer depuis un **méga-menu « Nos produits »** (desktop) ou un **tiroir mobile en drill-down** (on entre dans une catégorie, on remonte via « Retour »), tous deux pilotés par la même arborescence.
- Consulter des **fiches produit** présentant les **références (SKU)** par couleur × nombre de pages × réglure — la réglure est précisée dans le titre.
- Trouver les revendeurs sur une carte interactive avec une liste filtrable (section en veille pour le moment).
- Consulter les pages en français ou en anglais via un sélecteur `?lang=`.

## Points notables

- **Arborescence data-driven, source unique.** `lib/navigation.ts` décrit tout le catalogue (`navTree`) ; le même arbre alimente le méga-menu, le tiroir mobile, les sections de la page d'accueil et les pages `/c/[...slug]`. Remodeler la taxonomie = éditer un seul fichier.
- **Deux sources de références produit.** Les cahiers dérivent leur SKU de `lib/product-refs.ts` (table générée depuis le fichier XLSX du catalogue — ne pas éditer à la main), croisé avec les produits Prisma. Les produits « hors cahier » (feuillets mobiles, copies doubles, gamme plume…) portent leurs tableaux de références dans `lib/classement-refs.ts` (saisi à la main, vérifié contre les visuels du catalogue).
- **Table `Product` à plat, hiérarchie calculée dans le code.** Le schéma stocke une ligne à plat par cahier ; familles, formats et grille de disponibilité sont dérivés à la requête dans `lib/catalog.ts` (`familyKey` / `familyLabel`), sans migration pour remodeler la taxonomie. Les colonnes/lignes entièrement vides sont masquées dans les tableaux.
- **i18n maison via un paramètre d'URL `?lang=`.** Un dictionnaire écrit à la main dans `lib/i18n.ts` plutôt qu'une librairie ou un routage par locale — les Server Components lisent `getLang(searchParams)` et transmettent le dictionnaire ; les liens conservent le paramètre manuellement.
- **Les Server Components interrogent Prisma directement.** Les pages de route sont des Server Components `async` qui requêtent la base en ligne ; l'interactivité est confinée à de petits îlots client (la carte, la navigation du menu, le sélecteur de langue).

## Lancer en local

Nécessite Node et une base de données PostgreSQL.

```bash
cp .env.example .env          # puis renseigner DATABASE_URL
npm install                   # le postinstall lance `prisma generate` et a besoin de DATABASE_URL
npm run prisma:migrate        # applique les migrations à la base
npm run prisma:seed           # optionnel : charge des produits et revendeurs d'exemple
npm run dev                   # http://localhost:3000
```

`DATABASE_URL` doit être défini **avant** `npm install` — le hook `postinstall` lance `prisma generate`, qui le lit via `prisma.config.ts` et échoue sinon.

Autres scripts : `npm run build`, `npm start`, `npm run lint`.

Vérifié sur un clone neuf : `npm install` et `npm run build` réussissent. `prisma:migrate` et `prisma:seed` n'ont pas été exécutés contre une base réelle.

## État

En cours de développement. Reste à faire :

- **Section revendeurs en veille** : `ResellerSection` est commentée dans `app/page.tsx`. Quand elle sera réactivée, elle lit encore une liste codée en dur dans `components/reseller-section.tsx` ; la table `Reseller` (peuplée par le seed) n'est pas encore branchée à l'UI.
- **Visuels produit** : les fiches affichent un placeholder (« Visuel à venir ») via `ProductImage` tant que les images ne sont pas fournies ; le champ `image?` de l'arborescence est câblé mais non encore renseigné.
- **Catégories « Bientôt disponible »** : de nombreuses feuilles de `navTree` sont marquées `soon` (fournitures, accessoires, achats par niveau) en attendant leurs produits.
- `app/product/[slug]/page.tsx` est figé en `force-dynamic`.
- Placeholder `docs/screenshot.png` à capturer.
