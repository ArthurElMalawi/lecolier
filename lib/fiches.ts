import { fiches } from "./fiches.generated";
import { colorLabel } from "./colors";

/** Colonne de la fiche logistique (unité, paquet ou carton). */
export type Conditionnement = {
  quantite?: string;
  ean?: string;
  poids?: string;
  dimension?: string;
};

/**
 * Fiche produit d'une référence, extraite des PDF par scripts/extract-fiches.py.
 * Nos valeurs (product-refs, classement-refs) priment : le script corrige les
 * écarts connus avant génération. Les champs vides du PDF sont omis.
 */
export type FicheProduit = {
  designation: string;
  format?: string;
  pages?: string;
  papier?: string;
  grammage?: string;
  reglure?: string;
  couleursReglure?: string;
  couverture?: string;
  couleur?: string;
  finition?: string[];
  logistique: { unite: Conditionnement; paquet: Conditionnement; carton: Conditionnement };
  hsCode?: string;
  /** Visuel produit (public/fiches/<ref>.webp), absent si le PDF n'en a pas. */
  image?: string;
};

/** Fiche d'une référence, ou null si aucun PDF ne la décrit. */
export function ficheFor(ref: string): FicheProduit | null {
  return fiches[ref] ?? null;
}

/**
 * Traduction des valeurs des fiches (les PDF n'existent qu'en français).
 * Valeurs fixes d'abord, puis motifs (pagination, quantités, assortiments) ;
 * une valeur inconnue reste en français. La désignation n'est jamais traduite :
 * c'est le libellé de l'article.
 */
const VALUE_EN: Record<string, string> = {
  // Papier
  "Papier Blanc": "White paper",
  "Papier Blanc à Grains": "Grained white paper",
  "Papier Extra Blanc": "Extra white paper",
  "Papier Kraft Recyclé": "Recycled kraft paper",
  // Réglure
  "5x5": "Squared 5x5",
  "5x5 Petits Carreaux": "Squared 5x5",
  "Blanc Uni": "Plain",
  "Double Lignes 3mm": "Double lines 3 mm",
  "Seyès Grand Carreaux": "Seyes",
  "Uni à Grains": "Plain, grained",
  "3 Couleurs": "3 colours",
  "Une Couleur": "1 colour",
  // Couverture
  "CARTONNÉE 157GR": "Coated paper cover 157 gsm",
  "CARTONNÉE 230GR + UV": "UV-varnished hardcover 230 gsm",
  "Carte Couchée Brillant 180g/m²": "Gloss coated card 180 gsm",
  "Carte Couchée Brillant 230 g/m²": "Gloss coated card 230 gsm",
  "Polypropylène 300 microns": "Polypropylene 300 microns",
  "Polypropylène 700 microns": "Polypropylene 700 microns",
  "Assortie 4 Couleurs": "Assorted, 4 colours",
  // Finition
  "Agrafé": "Stapled",
  "Agrafé (Piqué)": "Stitched (stapled)",
  "Coins Arrondis": "Rounded corners",
  "Dos Carré": "Square spine",
  "Dos Carton Gris 400 g/m²": "Grey board back 400 gsm",
  "Dos Carton Gris 550 g/m²": "Grey board back 550 gsm",
  "Intercalaires PP 400 microns": "PP dividers 400 microns",
  "Microperforé": "Micro-perforated",
  "Spiralé": "Spiral-bound",
};

/** « Bleu, Orange, Rouge et Vert » → « Blue, Orange, Red and Green ». */
const colorList = (list: string) =>
  list.split(/, | et /).map((c) => colorLabel(c, "en")).join(", ").replace(/, ([^,]+)$/, " and $1");

const PATTERNS_EN: [RegExp, (...m: string[]) => string][] = [
  [/^(\d+) Pages \+ 4 Pages de Garde$/i, (_, n) => `${n} pages + 4 endpapers`],
  [/^(\d+) pages$/i, (_, n) => `${n} pages`],
  [/^(\d+) feuilles$/i, (_, n) => `${n} sheets`],
  [/^(\d+) unités?$/, (_, n) => `${n} unit${n === "1" ? "" : "s"}`],
  [/^Assorties x (\d+)(?: Couleurs)? \((.+)\)$/, (_, n, list) => `Assorted x ${n} (${colorList(list)})`],
];

/** Valeur de fiche dans la langue demandée (en anglais : point décimal, « gsm »). */
export function ficheValue(value: string, lang: "fr" | "en"): string {
  if (lang === "fr") return value;
  let en = VALUE_EN[value];
  for (const [re, fn] of PATTERNS_EN) {
    const m = en === undefined && value.match(re);
    if (m) en = fn(...m);
  }
  en ??= colorLabel(value, "en"); // coloris seul, ou valeur inconnue laissée telle quelle
  return en.replace(/(\d),(\d)/g, "$1.$2").replace(/ ?g\/m²/g, " gsm");
}

/** Libellés communs à la modale et au PDF généré. Les valeurs passent par `ficheValue`. */
export const FICHE_LABELS = {
  fr: {
    sheet: "Fiche produit",
    features: "Caractéristiques de l'article",
    logistics: "Fiche logistique",
    download: "Télécharger la fiche (PDF)",
    generating: "Génération…",
    close: "Fermer",
    noImage: "Visuel à venir",
    trademark: "L'écolier est une marque déposée",
    sections: { format: "Format", papier: "Papier", reglure: "Réglure", couverture: "Couverture", finition: "Finition" },
    fields: {
      dimension: "Dimension", pages: "Nombre de pages", qualite: "Qualité", grammage: "Grammage",
      type: "Type", couleurs: "Nombre de couleurs", couleur: "Couleur",
    },
    columns: { unite: "Unité", paquet: "Paquet", carton: "Carton" },
    log: { quantite: "Quantité", ean: "EAN", poids: "Poids", dimension: "Dimension", hsCode: "Code SH" },
  },
  en: {
    sheet: "Product sheet",
    features: "Product features",
    logistics: "Logistics",
    download: "Download the sheet (PDF)",
    generating: "Generating…",
    close: "Close",
    noImage: "Image coming soon",
    trademark: "L'écolier is a registered trademark",
    sections: { format: "Format", papier: "Paper", reglure: "Ruling", couverture: "Cover", finition: "Finish" },
    fields: {
      dimension: "Size", pages: "Number of pages", qualite: "Quality", grammage: "Weight",
      type: "Type", couleurs: "Number of colours", couleur: "Colour",
    },
    columns: { unite: "Unit", paquet: "Pack", carton: "Carton" },
    log: { quantite: "Quantity", ean: "EAN", poids: "Weight", dimension: "Size", hsCode: "HS code" },
  },
} as const;

export type FicheSection = { title: string; rows: { label?: string; value: string }[] };

/** Caractéristiques groupées par section, champs vides omis. */
export function ficheSections(f: FicheProduit, lang: "fr" | "en"): FicheSection[] {
  const L = FICHE_LABELS[lang];
  const section = (title: string, rows: [string | undefined, string | undefined][]): FicheSection => ({
    title,
    rows: rows.filter(([, v]) => v).map(([label, value]) => ({ label, value: ficheValue(value!, lang) })),
  });
  return [
    section(L.sections.format, [[L.fields.dimension, f.format]]),
    section(L.sections.papier, [
      [L.fields.pages, f.pages],
      [L.fields.qualite, f.papier],
      [L.fields.grammage, f.grammage],
    ]),
    section(L.sections.reglure, [
      [L.fields.type, f.reglure],
      [L.fields.couleurs, f.couleursReglure],
    ]),
    section(L.sections.couverture, [
      [L.fields.qualite, f.couverture],
      [L.fields.couleur, f.couleur],
    ]),
    section(L.sections.finition, (f.finition ?? []).map((v) => [undefined, v])),
  ].filter((s) => s.rows.length);
}

export const LOG_COLUMNS = ["unite", "paquet", "carton"] as const;
export const LOG_ROWS = ["quantite", "ean", "poids", "dimension"] as const;

/** Lignes logistiques renseignées dans au moins une colonne. */
export function ficheLogRows(f: FicheProduit) {
  return LOG_ROWS.filter((k) => LOG_COLUMNS.some((c) => f.logistique[c][k]));
}

/** Cellule logistique traduite, ou undefined si le PDF ne la renseigne pas. */
export function ficheLogCell(
  f: FicheProduit, col: (typeof LOG_COLUMNS)[number], row: (typeof LOG_ROWS)[number], lang: "fr" | "en",
) {
  const v = f.logistique[col][row];
  return v && ficheValue(v, lang);
}
