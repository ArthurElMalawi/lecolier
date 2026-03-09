# Documentation Frontend

## Architecture
Le projet utilise le **Next.js App Router**. L'interface est construite avec React et stylisée avec Tailwind CSS.

## Pages
- **Accueil (`app/page.tsx`) :**
    - Section Hero (`components/hero.tsx`) : Présentation de la marque avec appel à l'action.
    - Liste des familles de produits sous forme de cartes.
    - Section des revendeurs (`ResellerSection`) avec carte interactive.
    - Récupère les données produits via Prisma (Server Component).
- **Liste des Produits (`app/products/page.tsx`) :**
    - Affiche les formats disponibles pour une famille donnée.
    - Utilise les paramètres d'URL pour filtrer (`?family=...`).
- **Détail Produit (`app/product/[slug]/page.tsx`) :**
    - Affiche les détails complets d'un cahier (réglure, pages, etc.).
- **Qui sommes-nous (`app/qui-sommes-nous/page.tsx`) :**
    - Présentation de l'histoire, des valeurs et de la mission de la marque.

## Composants Clés
- **`components/header.tsx` :**
    - En-tête fixe avec logo, navigation et sélecteur de langue.
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

## Assets
- Les images produits sont stockées dans `public/products/`.
- Le logo et autres icônes sont à la racine de `public/`.
