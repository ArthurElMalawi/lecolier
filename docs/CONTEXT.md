# Contexte du Projet Lécolier

## Vue d'ensemble
Ce projet est un site vitrine pour la marque de cahiers "L'écolier". Il permet aux utilisateurs de parcourir le catalogue de produits, de voir les détails des cahiers et de trouver des revendeurs via une carte interactive. Le site est bilingue (Français/Anglais).

## Stack Technique
- **Framework :** Next.js 16.1.6 (App Router)
- **Langage :** TypeScript 5
- **UI :** React 19.2.3, Tailwind CSS 4
- **Données :** aucune base — modules TypeScript lus par les Server Components (Prisma/PostgreSQL retiré)
- **Images :** sharp (script d'ingestion hors runtime), `next/image` au rendu
- **Cartographie :** Leaflet / React-Leaflet
- **Icônes :** Lucide React

## Structure du Projet
- `app/` : Routes et pages de l'application (Next.js App Router).
- `components/` : Composants réutilisables (UI, Header, Footer, ProductSheet, RefTable, Carrousel, Map).
- `lib/` : Arborescence, références produit, visuels, i18n, utilitaires.
- `scripts/` : Scripts Node hors runtime (ingestion des visuels).
- `public/` : Assets statiques ; `public/catalogue/` est généré.
- `docs/` : Documentation du projet.

## Fonctionnalités Principales
1.  **Catalogue de Produits :**
    - Arborescence à plusieurs niveaux exposée par `/c/[...slug]`, pilotée par `lib/navigation.ts`.
    - Fiches produit avec tableaux de références (SKU) par couleur × pagination × format.
    - Carrousel de visuels sur chaque fiche, alimenté par `npm run images`.
    - Page de détail par format (slug unique) sous `/product/[slug]`.
2.  **Internationalisation (i18n) :**
    - Support FR/EN via paramètre d'URL (`?lang=fr` ou `?lang=en`).
    - Dictionnaires de traduction dans `lib/i18n.ts`.
3.  **Recherche de Revendeurs :**
    - Carte interactive (Leaflet).
    - Liste des revendeurs avec recherche textuelle.
    - Données revendeurs actuellement hardcodées (à migrer potentiellement en BDD).

## Commandes Utiles
- `npm run dev` : Lancer le serveur de développement.
- `npm run build` : Construire pour la production.
- `npm run start` : Lancer en production.
- `npm run lint` : ESLint.
- `npm run images` : Ré-ingérer les visuels produit depuis le dossier source et régénérer le manifeste.

## Tests
Aucun test automatisé pour le moment. La vérification se fait par `npx tsc --noEmit`,
`npm run lint` et `npm run build`.
