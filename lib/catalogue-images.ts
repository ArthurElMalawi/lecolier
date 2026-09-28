import type { Bi } from "./classement-refs";
import { COLOR_ORDER } from "./product-refs";
import { catalogueImages } from "./catalogue-images.generated";

/**
 * Visuel d'une page produit. `caption` décrit la vue (format, coloris, pagination…).
 *
 * `rank` classe les **types** de vue — couverture (10-20 selon le coloris), vue de
 * format sans coloris (60), coloris assortis (70), page de garde (80), réglure (90) —
 * et `color` rattache une vue ouverte à sa couverture. Les deux sont posés à
 * l'ingestion (scripts/ingest-catalogue-images.mts) et fixent l'ordre du carrousel.
 */
export type CatalogueImage = { src: string; caption?: Bi; rank?: number; color?: string };

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
 * Place d'un visuel dans l'ordre des coloris. `-1` pour ce qui n'en dépend pas —
 * vue de format, coloris assortis, réglure générique : ces vues ouvrent le carrousel.
 */
const colorIndex = (color?: string) => {
  if (!color) return -1;
  const i = COLOR_ORDER.indexOf(color);
  return i >= 0 ? i : COLOR_ORDER.length;
};

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
 * L'ordre suit le **coloris**, pas la portée. Ouvrent le carrousel les vues qui ne
 * dépendent d'aucune couleur — vue de format, coloris assortis, page de garde et
 * réglure génériques, dans cet ordre de `rank`. Viennent ensuite les coloris dans
 * l'ordre canonique, chacun suivi de ses vues ouvertes : orange, orange ouvert,
 * gris, gris ouvert…
 *
 * Un coloris n'apparaît qu'**une fois par taille** : le catalogue photographie chaque
 * pagination (bleu 48 p, bleu 96 p, bleu 192 p…) alors que les couvertures sont
 * identiques. Les faire défiler toutes noierait le carrousel — un 17 × 22 de la gamme
 * Premium passait ainsi de 11 coloris à 63 vues.
 */
export function imagesFor(navPath: string, variant?: string): CatalogueImage[] {
  const byVariant = catalogueImages[navPath];
  if (!byVariant) return [];

  const specificKeys = variant ? [variant] : Object.keys(byVariant).filter((k) => !isCommon(k));
  // Les tailles d'abord, les visuels de gamme ensuite : à type de vue égal, un 17×22
  // reste groupé avec les 17×22 plutôt que d'alterner avec les 24×32.
  const groups = [...specificKeys, ...commonVariants(byVariant, variant)];

  // Le rang d'une couverture EST son coloris (cf. colorRank à l'ingestion) : deux vues
  // de même rang dans une même taille montrent donc la même couverture. Hors de cette
  // plage le rang n'est qu'un type de vue — le 55 sert de repli aux visuels sans
  // coloris (Gamme Plume), les regrouper les écraserait les uns les autres.
  const isColorCover = (rank?: number) => rank !== undefined && rank >= 10 && rank <= 10 + COLOR_ORDER.length;
  const seen = new Set<string>();
  const ordered = groups
    .flatMap((key, group) => (byVariant[key] ?? []).map((img) => ({ img, group })))
    .sort(
      (a, b) =>
        // Les vues sans coloris d'abord, puis les coloris dans l'ordre canonique…
        colorIndex(a.img.color) - colorIndex(b.img.color) ||
        // …à coloris égal, la couverture avant ses vues ouvertes…
        (a.img.rank ?? 50) - (b.img.rank ?? 50) ||
        // …et à vue égale, taille par taille.
        a.group - b.group,
    )
    .filter(({ img, group }) => {
      if (!isColorCover(img.rank)) return true;
      const key = `${group}:${img.rank}`;
      return !seen.has(key) && seen.add(key);
    })
    .map((e) => e.img);

  return dedupe(ordered);
}

/** Visuels de plusieurs pages à la suite — une page qui en regroupe d'autres réunit leurs visuels. */
export function imagesForPages(navPaths: string[]): CatalogueImage[] {
  return dedupe(navPaths.flatMap((p) => imagesFor(p)));
}

/**
 * Visuels d'un produit au sein d'une page qui en présente plusieurs.
 *
 * Les photos nommées par référence portent leur SKU en nom de fichier (voir
 * scripts/ingest-catalogue-images.mts) : on retient celles dont le SKU figure dans le
 * tableau du produit. Les autres — réglure, page de garde — valent pour toute la page
 * et n'appartiennent à aucun produit en particulier, donc elles sont écartées.
 */
export function imagesForRefs(navPaths: string[], refs: Set<string>): CatalogueImage[] {
  return imagesForPages(navPaths).filter((img) => {
    const name = img.src.split("/").pop() ?? "";
    return refs.has(name.replace(/\.webp$/, ""));
  });
}

/**
 * Rang de la couverture « Assortit ». Dérivé de COLOR_ORDER comme à l'ingestion
 * (`colorRank` dans scripts/ingest-catalogue-images.mts) : un coloris ajouté à la
 * liste canonique décale les rangs, la vignette suit sans retouche ici.
 */
const ASSORTED_RANK = 10 + COLOR_ORDER.indexOf("Assortit");

/**
 * Vignette représentative d'une taille.
 *
 * La photo « Assortit » montre tous les coloris d'un coup : elle représente la
 * taille mieux qu'une couverture d'une seule couleur, qui n'en montre qu'un.
 * À défaut (taille sans photo d'assortiment), le premier visuel — propre à la
 * taille, sinon commun à la gamme.
 */
export function heroFor(navPath: string, variant: string): CatalogueImage | undefined {
  const byVariant = catalogueImages[navPath];
  if (!byVariant) return undefined;

  const candidates = [
    ...(byVariant[variant] ?? []),
    ...commonVariants(byVariant, variant).flatMap((k) => byVariant[k]),
  ];
  return candidates.find((img) => img.rank === ASSORTED_RANK) ?? candidates[0];
}

/** Une page a-t-elle au moins un visuel ? (une catégorie illustrée n'est plus « bientôt disponible ») */
export function hasImages(navPath: string): boolean {
  return catalogueImages[navPath] !== undefined;
}
