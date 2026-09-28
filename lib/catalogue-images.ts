import type { Bi } from "./classement-refs";
import { catalogueImages } from "./catalogue-images.generated";

/**
 * Visuel d'une page produit. `caption` décrit la vue (format, coloris, pagination…).
 *
 * `rank` classe les **types** de vue — couverture (10-20 selon le coloris), vue de
 * format sans coloris (60), coloris assortis (70), page de garde (80), réglure (90) —
 * et fixe l'ordre du carrousel. Il est posé à l'ingestion (scripts/ingest-catalogue-images.mts).
 */
export type CatalogueImage = { src: string; caption?: Bi; rank?: number };

type Variants = Record<string, CatalogueImage[]>;

/** Variante non spécifique à une taille : visuels communs à toute la gamme. */
const isCommon = (variant: string) => variant === "" || variant.startsWith("toutes-tailles");

/**
 * Variantes communes applicables à un produit.
 *
 * « toutes-tailles » vaut pour tout le monde ; « toutes-tailles-<réglure> » ne
 * concerne que les produits de cette réglure — les visuels Seyès n'apparaissent
 * donc pas sur une page 5×5. Sans produit précis (fiche de références), tout est retenu.
 */
function commonVariants(byVariant: Variants, variant?: string): string[] {
  const ruling = variant ? (variant.endsWith("-5x5") ? "5x5" : "seyes") : null;
  return Object.keys(byVariant).filter((k) => {
    if (!isCommon(k)) return false;
    if (k === "" || k === "toutes-tailles" || ruling === null) return true;
    return k === `toutes-tailles-${ruling}`;
  });
}

/**
 * Une vue montre-t-elle le produit (couverture, coloris assortis) ou un détail
 * (page de garde, réglure) ? Seuil aligné sur les rangs posés à l'ingestion.
 */
const detail = (rank = 50) => (rank >= 80 ? 1 : 0);

const dedupe = (images: CatalogueImage[]) => {
  const seen = new Set<string>();
  return images.filter((img) => !seen.has(img.src) && seen.add(img.src));
};

/**
 * Visuels d'une page produit.
 *
 * @param navPath chemin de la page dans l'arborescence (ex. « nos-cahiers/gamme-polypro-premium/cahiers »)
 * @param variant taille du produit affiché (ex. « 17x22 », « 24x32-5x5 ») ; omis, toutes les tailles.
 *
 * L'ordre suit le **type de vue** (`rank`), pas la portée : les couvertures ouvrent
 * le carrousel, les détails (page de garde, réglure) le ferment — qu'ils soient
 * communs à la gamme ou propres à une taille.
 */
export function imagesFor(navPath: string, variant?: string): CatalogueImage[] {
  const byVariant = catalogueImages[navPath];
  if (!byVariant) return [];

  const specificKeys = variant ? [variant] : Object.keys(byVariant).filter((k) => !isCommon(k));
  // Les tailles d'abord, les visuels de gamme ensuite : à type de vue égal, un 17×22
  // reste groupé avec les 17×22 plutôt que d'alterner avec les 24×32.
  const groups = [...specificKeys, ...commonVariants(byVariant, variant)];

  const ordered = groups
    .flatMap((key, group) => (byVariant[key] ?? []).map((img) => ({ img, group })))
    .sort(
      (a, b) =>
        // Toutes les couvertures avant tous les détails, quelle que soit la taille…
        detail(a.img.rank) - detail(b.img.rank) ||
        // …puis taille par taille, et dans l'ordre canonique des coloris.
        a.group - b.group ||
        (a.img.rank ?? 50) - (b.img.rank ?? 50),
    )
    .map((e) => e.img);

  return dedupe(ordered);
}

/** Visuels de plusieurs pages à la suite — une page qui en regroupe d'autres réunit leurs visuels. */
export function imagesForPages(navPaths: string[]): CatalogueImage[] {
  return dedupe(navPaths.flatMap((p) => imagesFor(p)));
}

/** Vignette représentative d'une taille : son premier visuel, à défaut un visuel commun. */
export function heroFor(navPath: string, variant: string): CatalogueImage | undefined {
  const byVariant = catalogueImages[navPath];
  if (!byVariant) return undefined;
  return byVariant[variant]?.[0] ?? commonVariants(byVariant, variant).flatMap((k) => byVariant[k])[0];
}

/** Une page a-t-elle au moins un visuel ? (une catégorie illustrée n'est plus « bientôt disponible ») */
export function hasImages(navPath: string): boolean {
  return catalogueImages[navPath] !== undefined;
}
