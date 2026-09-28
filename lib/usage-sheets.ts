/**
 * Fiches « usage » (Travaux Pratiques, Dessin & Musique, Maternelle) dérivées de
 * lib/product-refs.ts.
 *
 * Ces produits sont présentés à deux endroits du site : une page par gamme
 * (nos-cahiers/gamme-polypro-{premium,classique}/<usage>) et une page qui réunit
 * les deux gammes (nos-cahiers/cahiers-specialises/<usage>). Les tableaux étant
 * construits ici à partir de la même source, les deux ne peuvent plus diverger :
 * seuls les titres de section restent éditoriaux (ils reprennent le catalogue papier).
 */
import type { Bi, ProductSheet, RefRow, RefTableData } from "./classement-refs";
// Extension explicite : scripts/ingest-catalogue-images.mts charge ce module directement
// avec Node, qui ne devine pas les extensions comme le fait le bundler.
import { classementSheets } from "./classement-refs.ts";
import { availableFor, refFor, COLOR_ORDER } from "./product-refs.ts";

type Variant = "STD" | "TP" | "MAT" | "DESSIN";
type Ruling = "SEYES" | "QUADRI" | "LIGNE" | "BLANC";

const FORMATS = ["F17x22", "F21x29_7", "F24x32"] as const;
type Format = (typeof FORMATS)[number];

const DIM: Record<Format, Bi> = {
  F17x22: { fr: "17 × 22 cm", en: "17 × 22 cm" },
  F21x29_7: { fr: "21 × 29,7 cm", en: "21 × 29.7 cm" },
  F24x32: { fr: "24 × 32 cm", en: "24 × 32 cm" },
};
const P = (n: number): Bi => ({ fr: `${n} pages`, en: `${n} pages` });

/**
 * Références manquantes dans l'export Excel (lib/product-refs.ts) alors qu'elles
 * existent au catalogue. À réintégrer à la source ; déclarées ici en attendant
 * pour ne pas disparaître du site. Même format de clé que product-refs.
 */
const COMPLEMENTS: Record<string, string> = {
  "70|PP|F17x22|DESSIN|BLANC|Incolore|32": "48319",
  "70|PP|F24x32|DESSIN|BLANC|Incolore|32": "48324",
  "70|PP|F17x22|MAT|LIGNE|Assortit|32": "48314",
};

type Source = {
  grammage: number;
  variant: Variant;
  ruling: Ruling;
  /** Par défaut : pages en colonnes, formats en lignes. Sinon l'inverse. */
  layout?: "formats-en-colonnes";
};

const key = (s: Source, format: Format, color: string, pages: number) =>
  [s.grammage, "PP", format, s.variant, s.ruling, color, pages].join("|");

/** Coloris et paginations disponibles pour un format, compléments inclus. */
function optionsFor(s: Source, format: Format): { colors: string[]; pages: number[] } {
  const base = availableFor({ grammageGsm: s.grammage, cover: "PP", format, variant: s.variant, ruling: s.ruling });
  const colors = new Set(base.colors);
  const pages = new Set(base.pages);
  const prefix = [s.grammage, "PP", format, s.variant, s.ruling, ""].join("|");
  for (const k of Object.keys(COMPLEMENTS)) {
    if (!k.startsWith(prefix)) continue;
    const parts = k.split("|");
    colors.add(parts[5]);
    pages.add(Number(parts[6]));
  }
  const ordered = COLOR_ORDER.filter((c) => colors.has(c));
  for (const c of colors) if (!ordered.includes(c)) ordered.push(c);
  return { colors: ordered, pages: [...pages].sort((a, b) => a - b) };
}

function ref(s: Source, format: Format, color: string, pages: number): string | null {
  return (
    refFor({ grammageGsm: s.grammage, cover: "PP", format, variant: s.variant, ruling: s.ruling, color, pages }) ??
    COMPLEMENTS[key(s, format, color, pages)] ??
    null
  );
}

/** Tableau d'un usage pour une gamme, ou null si aucune référence. */
function buildTable(s: Source): RefTableData | null {
  const present = FORMATS.map((f) => ({ format: f, ...optionsFor(s, f) })).filter((f) => f.colors.length > 0);
  if (present.length === 0) return null;

  const allPages = [...new Set(present.flatMap((f) => f.pages))].sort((a, b) => a - b);

  if (s.layout === "formats-en-colonnes") {
    const colors = COLOR_ORDER.filter((c) => present.some((f) => f.colors.includes(c)));
    const rows: RefRow[] = [];
    for (const pages of allPages) {
      for (const color of colors) {
        const cells = present.map((f) => ref(s, f.format, color, pages));
        if (cells.some(Boolean)) rows.push({ color, label: P(pages), cells });
      }
    }
    return { columns: present.map((f) => DIM[f.format]), rows };
  }

  const rows: RefRow[] = [];
  for (const f of present) {
    for (const color of f.colors) {
      const cells = allPages.map((p) => ref(s, f.format, color, p));
      if (cells.some(Boolean)) rows.push({ color, label: DIM[f.format], cells });
    }
  }
  return { columns: allPages.map(P), rows };
}

/* -------------------------------------------------------------------------- */
/*  Sections : titre éditorial + source des références                          */
/* -------------------------------------------------------------------------- */

const S = {
  tpPremium: { grammage: 90, variant: "TP", ruling: "SEYES" },
  tpClassique: { grammage: 70, variant: "TP", ruling: "SEYES" },
  // Dessin : une seule pagination par produit, les formats se lisent mieux en colonnes.
  dessinPremium: { grammage: 90, variant: "DESSIN", ruling: "BLANC", layout: "formats-en-colonnes" },
  dessinClassique: { grammage: 70, variant: "DESSIN", ruling: "BLANC", layout: "formats-en-colonnes" },
  // Musique et Chants : papier uni, typé STD|BLANC dans l'export Excel.
  musiqueClassique: { grammage: 70, variant: "STD", ruling: "BLANC", layout: "formats-en-colonnes" },
  matPremium: { grammage: 90, variant: "MAT", ruling: "LIGNE" },
  matClassique: { grammage: 70, variant: "MAT", ruling: "LIGNE" },
} satisfies Record<string, Source>;

const T = {
  tpPremium: { fr: "Garantie Véritable Papier Dessin — 90 g/m²", en: "Genuine Drawing Paper — 90 gsm" },
  tpClassique: { fr: "Garantie Véritable Papier à Dessin — 70 g/m²", en: "Genuine Drawing Paper — 70 gsm" },
  dessinPremium: { fr: "Garantie Véritable Papier Dessin — 90 g/m²", en: "Genuine Drawing Paper — 90 gsm" },
  dessinClassique: { fr: "Dessin — Papier à Dessin 70 g/m²", en: "Drawing — 70 gsm drawing paper" },
  musiqueClassique: { fr: "Musique et Chants — 70 g/m²", en: "Music & Singing — 70 gsm" },
  matPremium: { fr: "Double Lignes 3 mm — 90 g/m²", en: "Double Lines 3 mm — 90 gsm" },
  matClassique: { fr: "Double Lignes 3 mm — 70 g/m²", en: "Double Lines 3 mm — 70 gsm" },

  // Pages « Cahiers Spécialisés » : les deux gammes réunies, titres du catalogue papier.
  tpPremiumMerged: { fr: "Gamme Premium — 90 g/m² + 90 g/m²", en: "Premium Range — 90 gsm + 90 gsm" },
  tpClassiqueMerged: { fr: "Gamme Classique — 70 g/m² + 90 g/m²", en: "Classic Range — 70 gsm + 90 gsm" },
  dessinPremiumMerged: { fr: "Gamme Premium — 90 g/m² — Dessin", en: "Premium Range — 90 gsm — Drawing" },
  dessinClassiqueMerged: { fr: "Gamme Classique — 70 g/m² — Dessin", en: "Classic Range — 70 gsm — Drawing" },
  musiqueMerged: { fr: "Gamme Classique — 70 g/m² — Musique et Chants", en: "Classic Range — 70 gsm — Music & Singing" },
  matPremiumMerged: { fr: "Gamme Premium — 90 g/m² — Double Lignes 3 mm", en: "Premium Range — 90 gsm — Double Lines 3 mm" },
  matClassiqueMerged: { fr: "Gamme Classique — 70 g/m² — Double Lignes 3 mm", en: "Classic Range — 70 gsm — Double Lines 3 mm" },
} satisfies Record<string, Bi>;

/** Assemble une fiche en ignorant les sections sans référence. */
function sheet(...sections: { section: Bi; source: Source }[]): ProductSheet {
  const built: ProductSheet = [];
  for (const s of sections) {
    const table = buildTable(s.source);
    if (table) built.push({ section: s.section, table });
  }
  return built;
}

/** Page par gamme d'où provient une section (sert aussi à réunir les visuels). */
const PAGE = {
  tpPremium: "nos-cahiers/gamme-polypro-premium/travaux-pratiques",
  tpClassique: "nos-cahiers/gamme-polypro-classique/travaux-pratiques",
  dessinPremium: "nos-cahiers/gamme-polypro-premium/dessin-musique-chant",
  dessinClassique: "nos-cahiers/gamme-polypro-classique/dessin-musique-chant",
  matPremium: "nos-cahiers/gamme-polypro-premium/maternelle-petite-ecole",
  matClassique: "nos-cahiers/gamme-polypro-classique/maternelle-petite-ecole",
} as const;

type Spec = { section: Bi; source: Source; from?: string };

const SPECS: Record<string, Spec[]> = {
  [PAGE.tpPremium]: [{ section: T.tpPremium, source: S.tpPremium }],
  [PAGE.tpClassique]: [{ section: T.tpClassique, source: S.tpClassique }],
  "nos-cahiers/cahiers-specialises/travaux-pratiques": [
    { section: T.tpClassiqueMerged, source: S.tpClassique, from: PAGE.tpClassique },
    { section: T.tpPremiumMerged, source: S.tpPremium, from: PAGE.tpPremium },
  ],

  [PAGE.dessinPremium]: [{ section: T.dessinPremium, source: S.dessinPremium }],
  [PAGE.dessinClassique]: [
    { section: T.dessinClassique, source: S.dessinClassique },
    { section: T.musiqueClassique, source: S.musiqueClassique },
  ],
  "nos-cahiers/cahiers-specialises/dessin-musique-chant": [
    { section: T.dessinPremiumMerged, source: S.dessinPremium, from: PAGE.dessinPremium },
    { section: T.dessinClassiqueMerged, source: S.dessinClassique, from: PAGE.dessinClassique },
    { section: T.musiqueMerged, source: S.musiqueClassique, from: PAGE.dessinClassique },
  ],

  [PAGE.matPremium]: [{ section: T.matPremium, source: S.matPremium }],
  [PAGE.matClassique]: [{ section: T.matClassique, source: S.matClassique }],
  "nos-cahiers/cahiers-specialises/maternelle-petite-ecole": [
    { section: T.matPremiumMerged, source: S.matPremium, from: PAGE.matPremium },
    { section: T.matClassiqueMerged, source: S.matClassique, from: PAGE.matClassique },
  ],
};

/**
 * Pages par gamme réunies par une page « Cahiers Spécialisés ».
 * Elle en affiche les tableaux : elle en affiche donc aussi les visuels.
 */
export function groupedPages(path: string): string[] {
  const from = (SPECS[path] ?? []).map((s) => s.from).filter((p): p is string => !!p && p !== path);
  return [...new Set(from)];
}

/** Fiches usage, construites une fois au chargement du module. */
export const usageSheets: Record<string, ProductSheet> = Object.fromEntries(
  Object.entries(SPECS).map(([path, sections]) => [path, sheet(...sections)]),
);

/**
 * Fiche d'une page : usage dérivé, sinon fiche saisie à la main (par chemin
 * complet puis par slug simple, les slugs d'usage se répétant selon la gamme).
 */
export function sheetFor(path: string, slug: string): ProductSheet | undefined {
  return usageSheets[path] ?? classementSheets[path] ?? classementSheets[slug];
}
