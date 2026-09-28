/**
 * Pages qui présentent PLUSIEURS produits distincts (fournitures, accessoires).
 *
 * Une page « Colle en Bâton » ne montre pas un produit décliné mais trois articles
 * différents : chacun a son visuel et sa référence. D'où cette notion de *ligne de
 * produit* — un carrousel + un tableau de références — là où lib/classement-refs.ts
 * décrit un seul produit par page.
 *
 * `variant` est aussi le sous-dossier où déposer les photos de la ligne
 * (Pictures/lecolier/catalogue-v1/<page>/<variant>/…, cf. scripts/ingest-catalogue-images.mts) :
 * chaque carrousel reçoit ainsi ses propres visuels. Ceux laissés à la racine de la
 * page restent communs à toutes les lignes.
 *
 * Source : relevé du catalogue fournisseur. Ces références ne figurent pas dans
 * lsiting_articles_complet.xlsx, qui ne couvre que les cahiers : elles sont saisies ici.
 */
import type { Bi, ProductSheet, RefRow, RefTableData } from "./classement-refs";

export type ProductLine = {
  /** Sous-dossier de visuels sous la page, et clé du carrousel. */
  variant: string;
  name: Bi;
  /** Précision affichée sous le nom (conditionnement, composition du kit…). */
  desc?: Bi;
  table: RefTableData;
};

/* ------------------------------ Raccourcis ------------------------------- */

const REF: Bi = { fr: "Référence", en: "Reference" };

const D = {
  f21x29_7: { fr: "21 × 29,7 cm", en: "21 × 29.7 cm" },
  f24x32: { fr: "24 × 32 cm", en: "24 × 32 cm" },
} satisfies Record<string, Bi>;

const PCS = (n: number): Bi => ({ fr: `${n} pièces`, en: `${n} pcs` });
const BOX = (n: number): Bi => ({ fr: `Boîte de ${n}`, en: `Box of ${n}` });

/** Ligne à référence unique : une seule cellule sous « Référence ». */
const single = (variant: string, name: Bi, ref: string, desc?: Bi): ProductLine => ({
  variant,
  name,
  desc,
  table: { columns: [REF], rows: [{ cells: [ref] }] },
});

/** Ligne déclinée en coloris : une pastille par ligne, une seule colonne. */
const byColor = (variant: string, name: Bi, colors: [string, string][], desc?: Bi): ProductLine => ({
  variant,
  name,
  desc,
  table: { columns: [REF], rows: colors.map(([color, ref]): RefRow => ({ color, cells: [ref] })) },
});

/* ------------------------------ Les produits ------------------------------ */

export const productLines: Record<string, ProductLine[]> = {
  /* --------------------------- Écriture et traçage -------------------------- */

  "fournitures/ecriture-tracage/kit-tracage": [
    {
      variant: "ps",
      name: { fr: "Kit de Traçage PS", en: "PS Geometry Set" },
      desc: {
        fr: "Règle 30 cm, équerre 60° et rapporteur — l'équerre 45° en plus dans le kit 4 pièces.",
        en: "30 cm ruler, 60° square and protractor — plus a 45° square in the 4-piece set.",
      },
      table: { columns: [PCS(4), PCS(3)], rows: [{ cells: ["40562", "40564"] }] },
    },
    {
      variant: "mathematique",
      name: { fr: "Kit de Traçage Mathématique", en: "Math Geometry Set" },
      desc: {
        fr: "Règle 30 cm, équerre 60°, rapporteur et compas plastique avec crayon L'écolier — l'équerre 45° en plus dans le kit 5 pièces.",
        en: "30 cm ruler, 60° square, protractor and L'écolier plastic compass with pencil — plus a 45° square in the 5-piece set.",
      },
      table: { columns: [PCS(4), PCS(5)], rows: [{ cells: ["40071", "40572"] }] },
    },
    {
      variant: "flex-incassable",
      name: { fr: "Kit de Traçage Flex Incassable", en: "Unbreakable Flex Geometry Set" },
      desc: {
        fr: "Règle 30 cm, équerre 60° et rapporteur incassables — l'équerre 45° en plus dans le kit 4 pièces.",
        en: "Unbreakable 30 cm ruler, 60° square and protractor — plus a 45° square in the 4-piece set.",
      },
      table: { columns: [PCS(4), PCS(3)], rows: [{ cells: ["40563", "40565"] }] },
    },
  ],

  "fournitures/ecriture-tracage/regles-equerres-compas": [
    single("compas", { fr: "Compas plastique avec crayon", en: "Plastic compass with pencil" }, "40560"),
    single(
      "compas-reglable",
      { fr: "Compas plastique réglable avec crayon", en: "Adjustable plastic compass with pencil" },
      "40561",
    ),
  ],

  "fournitures/ecriture-tracage/crayons-papier": [
    single("bois", { fr: "Crayon à papier bois HB n°2", en: "HB #2 wooden graphite pencil" }, "40553", BOX(10)),
    single("plastique", { fr: "Crayon à papier plastique", en: "Plastic graphite pencil" }, "40554", BOX(10)),
  ],

  "fournitures/ecriture-tracage/gommes": [
    single("t30", { fr: "Gomme T30", en: "T30 eraser" }, "40555"),
    single("t20", { fr: "Gomme T20", en: "T20 eraser" }, "40556"),
  ],

  "fournitures/ecriture-tracage/taille-crayons": [
    single(
      "2-trous",
      { fr: "Taille-crayon 2 trous avec mini réservoir", en: "Two-hole sharpener with mini canister" },
      "40128",
    ),
    single("design", { fr: "Taille-crayon Design", en: "Design sharpener" }, "40566"),
  ],

  /* --------------------------- Découpe et collage --------------------------- */

  "fournitures/decoupe-collage/colle-baton": [
    single("10g", { fr: "Bâton de colle 10 g", en: "10 g glue stick" }, "40557"),
    single("20g", { fr: "Bâton de colle 20 g", en: "20 g glue stick" }, "40558"),
    single("40g", { fr: "Bâton de colle 40 g", en: "40 g glue stick" }, "40559"),
  ],

  "fournitures/decoupe-collage/ciseaux": [
    single(
      "petite-enfance",
      { fr: "Ciseaux plastique petite enfance", en: "Toddler plastic scissors" },
      "40570",
    ),
    single("ecole", { fr: "Ciseaux d'école 12 cm (5\")", en: "12 cm (5\") school scissors" }, "40131"),
    single("grande-taille", { fr: "Ciseaux grande taille 18 cm", en: "18 cm large scissors" }, "40571"),
  ],

  /* ------------------------------- Art créatif ------------------------------ */

  "fournitures/art-creatif/papier-dessin-grain": [
    {
      variant: "180g",
      name: { fr: "Papier à Dessin Blanc à Grain — 180 g/m²", en: "White Textured Drawing Paper — 180 gsm" },
      desc: { fr: "Pochette de 12 feuilles", en: "Pack of 12 sheets" },
      table: { columns: [D.f21x29_7, D.f24x32], rows: [{ cells: ["48123", "48127"] }] },
    },
    {
      variant: "220g",
      name: { fr: "Papier à Dessin Blanc à Grain — 220 g/m²", en: "White Textured Drawing Paper — 220 gsm" },
      desc: { fr: "Pochette de 12 feuilles", en: "Pack of 12 sheets" },
      table: { columns: [D.f21x29_7, D.f24x32], rows: [{ cells: ["48125", "48129"] }] },
    },
  ],

  "fournitures/art-creatif/crayons-couleurs": [
    single(
      "bois",
      { fr: "Crayon de couleur bois 18 cm triangulaire", en: "18 cm triangular wooden colouring pencil" },
      "40550",
      BOX(12),
    ),
    single(
      "plastique",
      { fr: "Crayon de couleur plastique 18 cm triangulaire", en: "18 cm triangular plastic colouring pencil" },
      "40551",
      BOX(12),
    ),
    single(
      "plastique-gomme",
      {
        fr: "Crayon de couleur plastique 18 cm triangulaire avec gomme",
        en: "18 cm triangular plastic colouring pencil with eraser",
      },
      "40552",
      BOX(12),
    ),
  ],

  "fournitures/art-creatif/feutres": [
    single(
      "pointe-moyenne",
      { fr: "Feutres 12 couleurs pointe moyenne", en: "12-colour medium-tip markers" },
      "40569",
      BOX(12),
    ),
  ],

  /* --------------------------- Accessoires & quotidien ---------------------- */

  "accessoires/sacs-trousses/trousses": [
    byColor("2-zips", { fr: "Trousse 2 zips", en: "Two-zip pencil case" }, [
      ["Bleu marine", "40140"],
      ["Noir", "40142"],
      ["Rouge", "40144"],
    ]),
    single("haut-de-gamme", { fr: "Trousse haut de gamme", en: "Premium pencil case" }, "40568"),
  ],

  "accessoires/sacs-trousses/sacs-a-dos": [
    byColor("sac-a-dos", { fr: "Sac à dos", en: "Backpack" }, [
      ["Bleu marine", "40134"],
      ["Noir", "40136"],
      ["Rouge", "40138"],
    ]),
  ],
};

/* -------------------------------------------------------------------------- */

/** Lignes de produit d'une page (vide si la page n'en présente pas). */
export function linesFor(path: string): ProductLine[] {
  return productLines[path] ?? [];
}

/**
 * Les mêmes produits vus comme une fiche classique — un produit, une section.
 *
 * La recherche (lib/search-index) et l'ingestion des visuels
 * (scripts/ingest-catalogue-images.mts) lisent toutes les fiches par `sheetFor` :
 * les dériver ici évite d'avoir à leur apprendre un second format.
 */
export const lineSheets: Record<string, ProductSheet> = Object.fromEntries(
  Object.entries(productLines).map(([path, lines]) => [
    path,
    lines.map((l) => ({ section: l.name, table: l.table })),
  ]),
);
