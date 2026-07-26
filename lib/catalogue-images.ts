import type { Bi } from "./classement-refs";
import { catalogueImages } from "./catalogue-images.generated";

/** Visuel d'une page produit. `caption` décrit la vue (format, coloris, pagination…). */
export type CatalogueImage = { src: string; caption?: Bi };

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
 * Les visuels communs à la gamme (coloris assortis, page de garde, réglure)
 * ouvrent le carrousel, suivis de ceux propres à la taille affichée.
 */
export function imagesFor(navPath: string, variant?: string): CatalogueImage[] {
  const byVariant = catalogueImages[navPath];
  if (!byVariant) return [];

  const common = commonVariants(byVariant, variant).flatMap((k) => byVariant[k]);
  const specific = variant
    ? byVariant[variant] ?? []
    : Object.keys(byVariant)
        .filter((k) => !isCommon(k))
        .flatMap((k) => byVariant[k]);

  return dedupe([...common, ...specific]);
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
