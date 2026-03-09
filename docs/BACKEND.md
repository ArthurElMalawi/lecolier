# Documentation Backend & Data

## Base de Données
- **SGBD :** PostgreSQL
- **ORM :** Prisma
- **Schéma :** `prisma/schema.prisma`

### Modèles
**Product**
- `id`: Int (Primary Key)
- `nameFr`: String (Nom en français)
- `nameEn`: String (Nom en anglais)
- `slug`: String (Unique, utilisé pour les URLs)
- `grammageGsm`: Int
- `coverType`: Enum `CoverType`
- `format`: Enum `Format`
- `ruling`: Enum `Ruling` (Optionnel)
- `pages`: Int
- `color`: String? (Couleur de couverture)
- `imageUrl`: String (Chemin vers l'image dans `public/`)
- `createdAt`, `updatedAt`: DateTime

**Reseller**
- `id`: String (UUID, Primary Key)
- `name`: String (Nom du revendeur)
- `address`: String (Adresse complète)
- `city`: String (Ville)
- `country`: String (Pays)
- `phone`: String? (Numéro de téléphone, optionnel)
- `fax`: String? (Fax, optionnel)
- `email`: String? (Email de contact, optionnel)
- `website`: String? (Site web, optionnel)
- `lat`: Float (Latitude pour la carte)
- `lng`: Float (Longitude pour la carte)
- `createdAt`, `updatedAt`: DateTime

### Enums
- **CoverType :** `POLYPRO_PIQUE`, `POLYPRO`, `CARTONNE`
- **Format :** `F17x22`, `F21x29_7`, `F24x32`
- **Ruling :** `SEYES`, `LIGNE`, `QUADRI`, `BLANC`

## Accès aux Données
- **Server Components :** L'accès aux données se fait principalement directement dans les Server Components via `prisma.product.findMany()`.
    - Exemple : `app/page.tsx` récupère tous les produits pour grouper par famille.
    - Exemple : `app/products/page.tsx` filtre par grammage et type de couverture.

## API
- Actuellement, il n'y a pas de routes API REST ou GraphQL explicites (`app/api/`).
- Les interactions se font via le rendu serveur.

## Migrations
- Les migrations sont gérées par Prisma dans `prisma/migrations/`.
- Commande pour créer une migration : `npx prisma migrate dev --name <nom>`.

## Seed
- Un script de seed est disponible dans `prisma/seed.ts` pour peupler la base de données initialement via `npm run prisma:seed`.
- Il initialise à la fois les **Produits** (à partir d'une liste statique) et les **Revendeurs** (liste par défaut).
