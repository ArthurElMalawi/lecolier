/**
 * Fiches produit "Classement" (Feuillets Mobiles, Copies Doubles…).
 * Source : lsiting_articles_complet.xlsx (gamme 70g).
 *
 * Une fiche peut contenir PLUSIEURS produits (sections), chacun avec son
 * sous-titre et son tableau (réglure/perforation × nombre de pages).
 */
export type Bi = { fr: string; en: string };
export type RefTableData = {
  columns: Bi[];
  rows: { label: Bi; cells: (string | null)[] }[];
};
export type ProductSheet = { section: Bi; table: RefTableData }[];

const PAGES: Bi[] = [
  { fr: "100 pages", en: "100 sheets" },
  { fr: "200 pages", en: "200 sheets" },
  { fr: "300 pages", en: "300 sheets" },
];

const P = (n: number): Bi => ({ fr: `${n} pages`, en: `${n} pages` });

export const classementSheets: Record<string, ProductSheet> = {
  "gamme-plume": [
    {
      section: { fr: "", en: "" },
      table: {
        columns: [P(32), P(48), P(96), P(192), P(288)],
        rows: [
          {
            label: { fr: "17 × 22 cm", en: "17 × 22 cm" },
            cells: ["47942", "47825", "47828", "47831", "48369"],
          },
          {
            label: { fr: "21 × 29,7 cm", en: "21 × 29.7 cm" },
            cells: [null, null, "47834", "47837", null],
          },
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
          { label: { fr: "Seyès · perforés", en: "Seyès · punched" }, cells: ["44758", "44759", "47840"] },
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
          { label: { fr: "17×22 · non perforés", en: "17×22 · unpunched" }, cells: [null, "44753", null] },
          { label: { fr: "21×29,7 · perforés", en: "21×29.7 · punched" }, cells: ["44755", "44756", "47842"] },
          { label: { fr: "21×29,7 · non perforés", en: "21×29.7 · unpunched" }, cells: [null, "44754", null] },
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
