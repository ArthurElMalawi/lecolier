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
  // Clé par chemin complet (le slug « travaux-pratiques » se répète selon la gamme).
  "nos-cahiers/gamme-polypro-premium/travaux-pratiques": [
    {
      section: { fr: "Garantie Véritable Papier Dessin — 90 g/m²", en: "Genuine Drawing Paper — 90 gsm" },
      table: {
        columns: [P(60), P(96), P(192)],
        rows: [
          { label: { fr: "17×22", en: "17×22" }, cells: ["44610", "47847", "48134"] },
          { label: { fr: "17×22 · Rose", en: "17×22 · Pink" }, cells: [null, "47877", null] },
          { label: { fr: "21×29,7", en: "21×29.7" }, cells: [null, "44611", "47850"] },
          { label: { fr: "24×32", en: "24×32" }, cells: [null, "44612", "47853"] },
        ],
      },
    },
  ],
  "nos-cahiers/gamme-polypro-premium/dessin-musique-chant": [
    {
      section: { fr: "Garantie Véritable Papier Dessin — 90 g/m²", en: "Genuine Drawing Paper — 90 gsm" },
      table: {
        columns: [P(32), P(96)],
        rows: [
          { label: { fr: "17×22", en: "17×22" }, cells: ["44614", null] },
          { label: { fr: "24×32", en: "24×32" }, cells: [null, "47871"] },
        ],
      },
    },
  ],
  "nos-cahiers/gamme-polypro-premium/maternelle-petite-ecole": [
    {
      section: { fr: "Double Lignes 3 mm — 90 g/m²", en: "Double Lines 3 mm — 90 gsm" },
      table: {
        columns: [P(32)],
        rows: [{ label: { fr: "17×22", en: "17×22" }, cells: ["44613"] }],
      },
    },
  ],
  "nos-cahiers/gamme-polypro-classique/travaux-pratiques": [
    {
      section: { fr: "Garantie Véritable Papier à Dessin — 70 g/m²", en: "Genuine Drawing Paper — 70 gsm" },
      table: {
        columns: [P(96)],
        rows: [
          { label: { fr: "17×22", en: "17×22" }, cells: ["48308"] },
          { label: { fr: "24×32", en: "24×32" }, cells: ["48309"] },
        ],
      },
    },
  ],
  "nos-cahiers/gamme-polypro-classique/dessin-musique-chant": [
    {
      section: { fr: "Dessin — Papier à Dessin 70 g/m²", en: "Drawing — 70 gsm drawing paper" },
      table: {
        columns: [
          { fr: "17×22 · 32 p.", en: "17×22 · 32 p." },
          { fr: "24×32 · 96 p.", en: "24×32 · 96 p." },
        ],
        rows: [
          { label: { fr: "Orange", en: "Orange" }, cells: ["48315", "48320"] },
          { label: { fr: "Bleu", en: "Blue" }, cells: ["48316", "48321"] },
          { label: { fr: "Rouge", en: "Red" }, cells: ["48317", "48322"] },
          { label: { fr: "Vert", en: "Green" }, cells: ["48318", "48323"] },
          { label: { fr: "Incolore", en: "Clear" }, cells: ["48319", "48324"] },
        ],
      },
    },
    {
      section: { fr: "Musique et Chant — 70 g/m²", en: "Music — 70 gsm" },
      table: {
        columns: [P(32)],
        rows: [
          { label: { fr: "17×22", en: "17×22" }, cells: ["48325"] },
          { label: { fr: "24×32", en: "24×32" }, cells: ["48326"] },
        ],
      },
    },
  ],
  "nos-cahiers/gamme-polypro-classique/maternelle-petite-ecole": [
    {
      section: { fr: "Double Lignes 3 mm — 70 g/m²", en: "Double Lines 3 mm — 70 gsm" },
      table: {
        columns: [P(32)],
        rows: [{ label: { fr: "17×22", en: "17×22" }, cells: ["48314"] }],
      },
    },
  ],
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
