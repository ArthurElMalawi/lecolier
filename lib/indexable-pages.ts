import { parseFamilyKey } from "./catalog";
import { availableFor } from "./product-refs";
import { navTree, type NavNode } from "./navigation";
import { sheetFor, groupedPages } from "./usage-sheets";
import { linesFor } from "./product-lines";
import { imagesForPages } from "./catalogue-images";

/**
 * Pages à proposer aux moteurs : arborescence /c/... et fiches cahier /product/...,
 * dérivées des mêmes sources que les pages elles-mêmes.
 */

/**
 * Vrai quand /c/{path} n'affiche que « Bientôt disponible » : feuille sans famille,
 * ni fiche, ni lignes de produits, ni visuels (voir app/c/[...slug]/page.tsx).
 */
export function isComingSoon(path: string, node: NavNode): boolean {
  if (node.soon) return true;
  if (node.children?.length) return false;
  if (node.family || linesFor(path).length > 0 || sheetFor(path, node.slug)) return false;
  return imagesForPages([path, ...groupedPages(path)]).length === 0;
}

const FORMAT_SLUG: Record<string, string> = { F17x22: "17x22", F21x29_7: "21x29_7", F24x32: "24x32" };

/** Slugs des fiches cahier d'une famille, comme les liste la page de gamme. */
function productSlugs(family: string): string[] {
  const parsed = parseFamilyKey(family);
  if (!parsed) return [];
  const cover = parsed.cover === "CARTONNE" ? "CARTONNE" : "PP";
  const slugs: string[] = [];
  for (const [fmt, s] of Object.entries(FORMAT_SLUG)) {
    for (const ruling of ["SEYES", "QUADRI"]) {
      if (availableFor({ grammageGsm: parsed.grammage, cover, format: fmt, ruling }).pages.length > 0)
        slugs.push(`cahier-${family}-${s}${ruling === "QUADRI" ? "-5x5" : ""}`);
    }
  }
  return slugs;
}

export function indexablePaths(): string[] {
  const paths: string[] = [];
  const families = new Set<string>();
  const walk = (nodes: NavNode[], prefix: string[]) => {
    for (const n of nodes) {
      if (n.path) continue; // lien hors arborescence (/qui-sommes-nous…), listé à part
      const slugs = [...prefix, n.slug];
      const path = slugs.join("/");
      if (!isComingSoon(path, n)) paths.push(`/c/${path}`);
      if (n.family) families.add(n.family);
      if (n.children) walk(n.children, slugs);
    }
  };
  walk(navTree, []);
  for (const f of families) for (const s of productSlugs(f)) paths.push(`/product/${s}`);
  return paths;
}
