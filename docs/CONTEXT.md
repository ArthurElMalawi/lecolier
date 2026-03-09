# Contexte du Projet Lécolier

## Vue d'ensemble
Ce projet est un site vitrine pour la marque de cahiers "L'écolier". Il permet aux utilisateurs de parcourir le catalogue de produits, de voir les détails des cahiers et de trouver des revendeurs via une carte interactive. Le site est bilingue (Français/Anglais).

## Stack Technique
- **Framework :** Next.js 16.1.6 (App Router)
- **Langage :** TypeScript 5
- **UI :** React 19.2.3, Tailwind CSS 4
- **Base de données :** PostgreSQL
- **ORM :** Prisma 7.3.0
- **Cartographie :** Leaflet / React-Leaflet
- **Icônes :** Lucide React

## Structure du Projet
- `app/` : Routes et pages de l'application (Next.js App Router).
- `components/` : Composants Réutilisables (UI, Header, Footer, Map).
- `lib/` : Utilitaires, configuration Prisma, i18n.
- `prisma/` : Schéma de base de données et migrations.
- `public/` : Assets statiques (images, icônes).
- `docs/` : Documentation du projet.

## Fonctionnalités Principales
1.  **Catalogue de Produits :**
    - Affichage par familles de produits (Grammage/Couverture).
    - Filtrage par format.
    - Page de détail produit (slug unique).
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
- `npx prisma studio` : Interface GUI pour la base de données.
- `npm run prisma:migrate` : Appliquer les migrations de BDD.
