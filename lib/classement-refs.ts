/**
 * Fiches produit "Classement" (Feuillets Mobiles, Copies Doubles…).
 * Source : lsiting_articles_complet.xlsx (gamme 70g).
 *
 * Une fiche peut contenir PLUSIEURS produits (sections), chacun avec son
 * sous-titre et son tableau (réglure/perforation × nombre de pages).
 */
export type Bi = { fr: string; en: string };

/**
 * Une ligne de tableau porte une couleur (rendue en PASTILLE, jamais en toutes
 * lettres) et/ou un libellé texte (dimension, réglure, perforation…).
 */
export type RefRow = {
  color?: string;
  label?: Bi;
  cells: (string | null)[];
};
export type RefTableData = {
  columns: Bi[];
  rows: RefRow[];
};
export type ProductSheet = { section: Bi; table: RefTableData }[];

const PAGES: Bi[] = [
  { fr: "100 pages", en: "100 sheets" },
  { fr: "200 pages", en: "200 sheets" },
  { fr: "300 pages", en: "300 sheets" },
];

const P = (n: number): Bi => ({ fr: `${n} pages`, en: `${n} pages` });

/** Libellés de dimension réutilisés par les fiches. */
const D = {
  f17x22: { fr: "17 × 22 cm", en: "17 × 22 cm" },
  f21x29_7: { fr: "21 × 29,7 cm", en: "21 × 29.7 cm" },
  f24x32: { fr: "24 × 32 cm", en: "24 × 32 cm" },
} satisfies Record<string, Bi>;

/** Dimensions utilisées en colonnes (blocs, spiralés…). */
const C = {
  a4: { fr: "A4", en: "A4" },
  a5: { fr: "A5", en: "A5" },
  ref: { fr: "Référence", en: "Reference" },
} satisfies Record<string, Bi>;

/**
 * Fiches saisies à la main. Les usages TP / Dessin & Musique / Maternelle n'y
 * figurent plus : leurs tableaux sont dérivés de product-refs.ts par lib/usage-sheets.ts,
 * pour que la page par gamme et la page « Cahiers Spécialisés » ne divergent pas.
 */
export const classementSheets: Record<string, ProductSheet> = {

  /* --- Prises de notes & spiralés --- */
  "cahiers-spirales-8-sujets": [
    {
      section: { fr: "Cahiers Spiralés — 8 intercalaires · Papier 80 g/m²", en: "Spiral Notebooks — 8 dividers · 80 gsm paper" },
      table: {
        columns: [D.f17x22, { fr: "A4 — 21 × 29,7 cm", en: "A4 — 21 × 29.7 cm" }],
        rows: [
          { color: "Gris", cells: ["44762", "44764"] },
          { color: "Noir", cells: ["44763", "44765"] },
        ],
      },
    },
  ],
  "blocs-notes": [
    {
      section: { fr: "", en: "" },
      table: {
        columns: [C.a4, C.a5],
        rows: [
          { label: { fr: "70 g/m² — couverture 230 g", en: "70 gsm — 230 g cover" }, cells: ["47806", "47809"] },
          { label: { fr: "55 g/m² — couverture 180 g", en: "55 gsm — 180 g cover" }, cells: ["48358", "48357"] },
        ],
      },
    },
  ],

  /* --- Classement : protège-cahiers --- */
  "proteges-cahiers": [
    {
      section: {
        fr: "17 × 22 cm — Grain cuir avec porte-étiquette · 22/100e",
        en: "17 × 22 cm — Leather grain with label holder · 22/100",
      },
      table: {
        columns: [C.ref],
        rows: [
          { color: "Bleu", cells: ["40175"] },
          { color: "Rouge", cells: ["40176"] },
          { color: "Jaune", cells: ["40177"] },
          { color: "Vert", cells: ["40178"] },
          { color: "Violet", cells: ["40179"] },
          { color: "Noir", cells: ["40180"] },
          { color: "Orange", cells: ["40181"] },
          { color: "Rose", cells: ["40182"] },
          { color: "Bleu clair", cells: ["40183"] },
          { color: "Vert clair", cells: ["40184"] },
          { color: "Brun", cells: ["40185"] },
          { color: "Gris", cells: ["40186"] },
        ],
      },
    },
  ],

  /* --- Accessoires & quotidien --- */
  "gourdes-bpa": [
    {
      section: {
        fr: "Gourdes en plastique sans BPA — 4 couleurs assorties",
        en: "BPA-free plastic bottles — 4 assorted colours",
      },
      table: {
        columns: [C.ref],
        rows: [{ color: "Assortit", label: { fr: "500 ml", en: "500 ml" }, cells: ["48131"] }],
      },
    },
  ],
  "sacs-kraft": [
    {
      section: { fr: "", en: "" },
      table: {
        columns: [C.ref],
        rows: [
          { label: { fr: "20 × 26 × 12 cm", en: "20 × 26 × 12 cm" }, cells: ["49818"] },
          { label: { fr: "30 × 38 × 14 cm", en: "30 × 38 × 14 cm" }, cells: ["49820"] },
          { label: { fr: "38 × 40 × 16 cm", en: "38 × 40 × 16 cm" }, cells: ["49822"] },
        ],
      },
    },
  ],

  "gamme-plume": [
    {
      section: { fr: "", en: "" },
      table: {
        columns: [P(32), P(48), P(96), P(192), P(288)],
        rows: [
          { label: D.f17x22, cells: ["47942", "47825", "47828", "47831", "48369"] },
          { label: D.f21x29_7, cells: [null, null, "47834", "47837", null] },
        ],
      },
    },
  ],
  "feuillets-mobiles": [
    {
      section: { fr: "Feuillets Mobiles — 21 × 29,7 cm", en: "Loose-Leaf Sheets — 21 × 29.7 cm" },
      table: {
        columns: PAGES,
        rows: [
          { label: { fr: "Seyès · perforés", en: "Seyès · punched" }, cells: ["44758", "44759", "44840"] },
          { label: { fr: "5×5 · perforés", en: "5×5 · punched" }, cells: ["44760", "44761", null] },
        ],
      },
    },
  ],
  "copies-doubles": [
    {
      section: { fr: "Copies Doubles — Seyès", en: "Folded Sheets — Seyès" },
      table: {
        columns: PAGES,
        rows: [
          { label: { fr: "17×22 · non perforés", en: "17×22 · unpunched" }, cells: [null, "44754", null] },
          { label: { fr: "21×29,7 · perforés", en: "21×29.7 · punched" }, cells: ["44755", "44756", "47842"] },
          { label: { fr: "21×29,7 · non perforés", en: "21×29.7 · unpunched" }, cells: [null, "44753", null] },
        ],
      },
    },
    {
      section: { fr: "Copies Doubles — 5×5", en: "Folded Sheets — 5×5" },
      table: {
        columns: PAGES,
        rows: [{ label: { fr: "21×29,7 · perforés", en: "21×29.7 · punched" }, cells: [null, "44757", null] }],
      },
    },
  ],
};
