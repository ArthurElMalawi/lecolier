/**
 * Ingestion des visuels produits.
 *
 *   node --experimental-strip-types scripts/ingest-catalogue-images.mts [dossier-source]
 *
 * Source par défaut : C:\Users\arthu\Pictures\lecolier\catalogue-v1, dont l'arborescence
 * reproduit celle du menu (voir lib/navigation.ts), avec un niveau optionnel de « variante »
 * sous la page produit :
 *
 *   nos-cahiers/gamme-polypro-premium/cahiers/17x22/*.png        -> variante « 17x22 »
 *   nos-cahiers/gamme-polypro-premium/cahiers/toutes-tailles/*   -> visuels communs à la gamme
 *   fournitures/classement/copies-doubles/*.png                  -> variante « » (commun)
 *
 * Un fichier nommé par son numéro de référence (« 44519.png ») n'a pas besoin d'être rangé
 * si finement : l'export dit déjà sa gamme, son usage, sa taille et son coloris. Il suffit
 * de le déposer à la racine de sa gamme (voir « Placement » plus bas).
 *
 * Produit :
 *   - public/catalogue/**.webp            (redimensionné, dédoublonné par empreinte)
 *   - lib/catalogue-images.generated.ts   (manifeste consommé par lib/catalogue-images.ts)
 *
 * Le dossier public/catalogue et le manifeste sont entièrement régénérés à chaque exécution :
 * ajouter des images dans le dossier source puis relancer le script suffit.
 */
import { createHash } from "node:crypto";
import { readdirSync, statSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { join, relative, extname, basename } from "node:path";
import sharp from "sharp";

import { findByPath, navTree, type NavNode } from "../lib/navigation.ts";
import { attributesFor, isKnownRef, COLOR_ORDER, type RefAttributes } from "../lib/product-refs.ts";
import { sheetFor, groupedPages } from "../lib/usage-sheets.ts";
import { colorLabel } from "../lib/colors.ts";

type Bi = { fr: string; en: string };

const SRC = process.argv[2] ?? "C:\\Users\\arthu\\Pictures\\lecolier\\catalogue-v1";
const PROJECT = join(import.meta.dirname, "..");
const PUBLIC_DIR = join(PROJECT, "public", "catalogue");
const MANIFEST = join(PROJECT, "lib", "catalogue-images.generated.ts");

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const MAX_SIDE = 1400;
const WEBP_QUALITY = 88;

/* ------------------------------- Normalisation ------------------------------ */

/**
 * Minuscules sans accents ni diacritiques.
 *
 * Les fichiers venant de macOS arrivent en NFD, et certains ont travers\u00e9 une
 * console CP437 : l'accent combinant (UTF-8 0xCC/0xCD + suite) s'y lit comme un
 * caract\u00e8re de filet suivi d'un caract\u00e8re parasite (\u00ab Piq\u00fbre \u00bb -> \u00ab Piqu\u2560\u00e9re \u00bb).
 * On supprime ces paires avant la normalisation classique.
 */
const plain = (s: string) =>
  s
    .replace(/[\u2550\u2560]./g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const slugify = (s: string) =>
  plain(s)
    .replace(/\+/g, "-plus") // « Réglure+ » et « Réglure » ne doivent pas donner le même nom
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * Variante = segments sous la page produit. « 21x29.7 » -> « 21x29_7 », tolère « toute-tailles ».
 * Un suffixe de réglure est conservé : « toutes-tailles-seyes » ne vaut que pour les pages Seyès
 * (voir COMMON_VARIANTS dans lib/catalogue-images.ts).
 */
function normalizeVariant(segments: string[]): string {
  const v = slugify(segments.join("-")).replace(/\./g, "_");
  const common = v.match(/^toutes?-tailles(-.+)?$/);
  if (common) return `toutes-tailles${common[1] ?? ""}`;
  return v.replace(/^21x29-7$/, "21x29_7").replace(/^(\d+)x(\d+)-(\d+)$/, "$1x$2_$3");
}

/* --------------------------------- Légendes -------------------------------- */

const FORMATS: Record<string, Bi> = {
  "170x220": { fr: "17 × 22 cm", en: "17 × 22 cm" },
  "210x297": { fr: "21 × 29,7 cm", en: "21 × 29.7 cm" },
  "240x320": { fr: "24 × 32 cm", en: "24 × 32 cm" },
};

/** Ordre d'affichage des coloris = ordre des lignes du tableau de références. */
const COLORS: [string, Bi][] = [
  ["orange", { fr: "Orange", en: "Orange" }],
  ["gris", { fr: "Gris", en: "Grey" }],
  ["jaune", { fr: "Jaune", en: "Yellow" }],
  ["rose", { fr: "Rose", en: "Pink" }],
  ["violet", { fr: "Violet", en: "Purple" }],
  ["bleu", { fr: "Bleu", en: "Blue" }],
  ["rouge", { fr: "Rouge", en: "Red" }],
  ["vert", { fr: "Vert", en: "Green" }],
  ["brun", { fr: "Brun", en: "Brown" }],
  ["noir", { fr: "Noir", en: "Black" }],
  ["incolore", { fr: "Incolore", en: "Clear" }],
];

/** Usage lu dans le nom d'une vue « réglure », pour distinguer des visuels par ailleurs jumeaux. */
const RULING_USAGE: [RegExp, Bi][] = [
  [/musique et chant/, { fr: "Musique et Chant", en: "Music & Singing" }],
  [/\bdessin\b/, { fr: "Dessin", en: "Drawing" }],
  [/\bdl\b|double ligne/, { fr: "Double lignes", en: "Double lines" }],
  // « Sans réglure » = papier uni. Ne pas confondre avec « sans couverture ».
  [/sans reglure|\bsans\b(?! couverture)/, { fr: "Sans réglure", en: "Unruled" }],
  [/seyes/, { fr: "Réglure Seyès", en: "Seyès ruling" }],
];

type Parsed = { caption: Bi | null; rank: number; pages: number };

/** Déduit une légende bilingue du nom de fichier (ex. « … - 170x220_bleu_48P »). */
function parseName(file: string): Parsed {
  const n = plain(basename(file, extname(file))).replace(/[_-]+/g, " ");

  const fr: string[] = [];
  const en: string[] = [];
  let rank = 0;
  let pages = 0;

  const format = Object.keys(FORMATS).find((f) => n.includes(f));
  if (format) {
    fr.push(FORMATS[format].fr);
    en.push(FORMATS[format].en);
  }

  const color = COLORS.find(([key]) => new RegExp(`\\b${key}\\b`).test(n));
  if (color) {
    fr.push(color[1].fr);
    en.push(color[1].en);
    rank = 10 + COLORS.indexOf(color);
  } else if (format) {
    // Vue « format » sans coloris (couverture incolore) : après les coloris, qui
    // servent de vitrine (première image du carrousel, vignette des cartes).
    rank = 60;
  }

  // « 48P », « 96 pages », ou le nombre en fin de nom quand le « P » a été oublié.
  const p = n.match(/\b(\d{2,3})\s*p(?:ages?)?\b/) ?? n.match(/\s(\d{2,3})$/);
  if (p) {
    pages = Number(p[1]);
    fr.push(`${pages} pages`);
    en.push(`${pages} pages`);
  }

  if (/\bnot perforated\b|\bnon perfor/.test(n)) {
    fr.push("Non perforées");
    en.push("Unpunched");
  } else if (/\bperfor/.test(n)) {
    fr.push("Perforées");
    en.push("Punched");
  }

  if (/\b5\s*x\s*5\b/.test(n)) {
    fr.push("Réglure 5×5");
    en.push("5×5 ruling");
  }

  // Visuels « détail » : toujours présentés après les vues produit.
  if (/\b\d+ couleurs\b/.test(n)) {
    return { caption: { fr: "Coloris assortis", en: "Assorted colours" }, rank: 70, pages };
  }
  if (/page de garde/.test(n)) {
    return { caption: { fr: "Page de garde personnalisable", en: "Customizable title page" }, rank: 80, pages };
  }
  if (/reglure/.test(n)) {
    const zoom = /reglure\s*\+/.test(n) || n.includes("reglure+");
    if (zoom) return { caption: { fr: "Intérieur — réglure Seyès", en: "Inside — Seyès ruling" }, rank: 90, pages };

    // Un lot entier de « …_Reglure » ne peut pas s'intituler pareil : le nom porte
    // l'usage (et souvent le coloris, déjà accumulé plus haut).
    const usage = RULING_USAGE.find(([re]) => re.test(n))?.[1];
    if (usage) {
      fr.push(usage.fr);
      en.push(usage.en);
    }
    return {
      caption: fr.length ? { fr: fr.join(" · "), en: en.join(" · ") } : { fr: "Détail de la réglure", en: "Ruling close-up" },
      rank: 91,
      pages,
    };
  }

  return { caption: fr.length ? { fr: fr.join(" · "), en: en.join(" · ") } : null, rank, pages };
}

/* -------------------------------- Placement -------------------------------- */

/**
 * Où va un visuel, et comment il se légende. Trois régimes, du plus précis au plus
 * tolérant :
 *
 *   1. nom = numéro de référence  -> la page est celle dont la fiche affiche cette
 *      référence (PAGE_BY_REF), à défaut la page d'usage de sa gamme ; la taille, le
 *      coloris et la pagination viennent de l'export. Le dossier ne sert à rien.
 *   2. nom en clair à la racine d'une gamme -> NAME_RULES déduit l'usage et la portée
 *      (réglures, pages de garde, pictogrammes, qui valent pour toutes les tailles).
 *   3. sinon -> le dossier fait foi, convention historique.
 */
type Placement = { navPath: string; variant: string; caption: Bi | null; rank: number; pages: number };

/** Rang d'affichage d'un coloris : même ordre que les lignes du tableau de références. */
const colorRank = (color?: string) => {
  const i = color ? COLOR_ORDER.indexOf(color) : -1;
  return i >= 0 ? 10 + i : 55;
};

/**
 * Page d'origine de chaque référence, lue dans les fiches que le site rend vraiment.
 *
 * C'est le signal le plus fiable : si un tableau affiche la référence, la photo va sur
 * cette page. Les pages qui en regroupent d'autres (« Cahiers Spécialisés ») sont
 * écartées — elles héritent déjà des visuels de leurs sources (cf. groupedPages).
 * Les pages de gamme (« Cahiers ») n'ont pas de fiche : elles passent par GAMME.
 */
const PAGE_BY_REF = (() => {
  const map = new Map<string, { navPath: string; caption: Bi; rank: number }>();

  const walk = (nodes: NavNode[], trail: string[]) => {
    for (const node of nodes) {
      const here = [...trail, node.slug];
      const navPath = here.join("/");
      const children = node.children ?? [];

      if (children.length === 0 && groupedPages(navPath).length === 0) {
        for (const { table } of sheetFor(navPath, node.slug) ?? []) {
          for (const row of table.rows) {
            row.cells.forEach((cell, i) => {
              if (!cell || map.has(cell)) return;
              const column = table.columns[i];
              const label = (lang: "fr" | "en") =>
                [row.color && colorLabel(row.color, lang), row.label?.[lang], column?.[lang]]
                  .filter(Boolean)
                  .join(" · ");
              map.set(cell, { navPath, caption: { fr: label("fr"), en: label("en") }, rank: colorRank(row.color) });
            });
          }
        }
      }
      walk(children, here);
    }
  };

  walk(navTree, []);
  return map;
})();

/** Racine de la gamme d'un produit, d'après son grammage et sa couverture (cf. navTree). */
const GAMME: Record<string, string> = {
  "90|PP": "nos-cahiers/gamme-polypro-premium",
  "70|PP": "nos-cahiers/gamme-polypro-classique",
  "56|CARTONNE": "nos-cahiers/gamme-cartonnee-plume/gamme-plume",
};

const FORMAT_DIM: Record<string, Bi> = {
  F17x22: { fr: "17 × 22 cm", en: "17 × 22 cm" },
  F21x29_7: { fr: "21 × 29,7 cm", en: "21 × 29.7 cm" },
  F24x32: { fr: "24 × 32 cm", en: "24 × 32 cm" },
};

const FORMAT_VARIANT: Record<string, string> = { F17x22: "17x22", F21x29_7: "21x29_7", F24x32: "24x32" };

/** Sous-page si elle existe, sinon la page elle-même (la Gamme Plume n'a pas d'usages). */
const childPath = (parent: string, slug: string) =>
  findByPath([...parent.split("/"), slug]) ? `${parent}/${slug}` : parent;

/** Références qu'on n'a pas su placer, listées en fin d'exécution. */
const unplaced: string[] = [];

/**
 * Page d'usage sous la gamme (slugs de `usages()` dans lib/navigation.ts).
 *
 * La réglure l'emporte sur la variante quand l'export les contredit : « Musique et
 * Chants » y est typé STD|BLANC alors que la page qui le présente est « Dessin &
 * Musique et Chant » (cf. musiqueClassique dans lib/usage-sheets.ts).
 */
function usageSlug(a: RefAttributes): string {
  if (a.variant === "TP") return "travaux-pratiques";
  if (a.variant === "MAT" || a.ruling === "LIGNE") return "maternelle-petite-ecole";
  if (a.variant === "DESSIN" || a.ruling === "BLANC") return "dessin-musique-chant";
  return "cahiers";
}

function placeByRef(ref: string): Placement | null {
  const sheet = PAGE_BY_REF.get(ref);
  const a = attributesFor(ref);

  if (!sheet && !a) {
    unplaced.push(`${ref} — ${isKnownRef(ref) ? "deux clés contradictoires dans l'export" : "absente de l'export et des fiches"}`);
    return null;
  }

  // Sans attributs, la fiche suffit : sa page ne se décline pas par taille.
  if (!a) return { navPath: sheet!.navPath, variant: "", caption: sheet!.caption, rank: sheet!.rank, pages: 0 };

  const gamme = GAMME[`${a.grammageGsm}|${a.cover}`];
  if (!sheet && !gamme) {
    unplaced.push(`${ref} — aucune gamme pour ${a.grammageGsm} g ${a.cover}`);
    return null;
  }

  const base = FORMAT_VARIANT[a.format] ?? "";
  return {
    // La fiche qui affiche la référence l'emporte sur la gamme déduite du grammage.
    navPath: sheet?.navPath ?? childPath(gamme!, usageSlug(a)),
    // Le 5×5 est une page à part : seul le 24×32 le propose.
    variant: base && a.format === "F24x32" && a.ruling === "QUADRI" ? "24x32-5x5" : base,
    caption: {
      fr: [FORMAT_DIM[a.format]?.fr, colorLabel(a.color, "fr"), `${a.pages} pages`].filter(Boolean).join(" · "),
      en: [FORMAT_DIM[a.format]?.en, colorLabel(a.color, "en"), `${a.pages} pages`].filter(Boolean).join(" · "),
    },
    rank: colorRank(a.color),
    pages: a.pages,
  };
}

/**
 * Visuels transverses déposés à la racine d'une gamme : le nom dit l'usage et la portée.
 * Premier motif qui correspond — l'ordre compte (« Petite École … Page de garde » est
 * une page de garde de maternelle, pas du cahier courant).
 */
const NAME_RULES: { match: RegExp; usage: string; variant: string }[] = [
  { match: /petite ecole|double ligne|\bdl\b/, usage: "maternelle-petite-ecole", variant: "toutes-tailles" },
  { match: /page de garde tp/, usage: "travaux-pratiques", variant: "toutes-tailles" },
  // « Sans réglure » = papier uni, présenté avec Musique et Chant. « Sans couverture » non.
  { match: /musique et chant|\bdessin\b|sans reglure|\bsans\b(?! couverture)/, usage: "dessin-musique-chant", variant: "toutes-tailles" },
  { match: /\b5 ?x ?5\b/, usage: "cahiers", variant: "toutes-tailles-5x5" },
  { match: /seyes|reglure 3 couleurs/, usage: "cahiers", variant: "toutes-tailles-seyes" },
  { match: /page de garde/, usage: "cahiers", variant: "toutes-tailles" },
];

function place(file: string, folderPath: string, rest: string[]): Placement | null {
  const name = basename(file, extname(file));
  if (/^\d{4,6}$/.test(name)) return placeByRef(name);

  const { caption, rank, pages } = parseName(file);

  // Les règles de nom ne servent qu'à répartir un dossier de gamme resté plat :
  // un visuel déjà rangé sous une page d'usage garde sa place.
  if (rest.length === 0 && findByPath([...folderPath.split("/"), "cahiers"])) {
    const n = plain(name).replace(/[_-]+/g, " ");
    const rule = NAME_RULES.find((r) => r.match.test(n));
    if (rule) return { navPath: childPath(folderPath, rule.usage), variant: rule.variant, caption, rank, pages };
  }

  return { navPath: folderPath, variant: normalizeVariant(rest), caption, rank, pages };
}

/* ------------------------------- Parcours source ---------------------------- */

type Entry = { navPath: string; variant: string; src: string; caption: Bi | null; rank: number; pages: number };

const entries: Entry[] = [];
// Empreinte (page + contenu) -> chemin public déjà écrit : un même visuel dupliqué
// dans plusieurs sous-dossiers d'une page n'est copié qu'une fois.
const bySignature = new Map<string, string>();
const written = new Set<string>();
let converted = 0;

async function walk(dir: string) {
  for (const name of readdirSync(dir).sort()) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      await walk(full);
      continue;
    }
    if (!IMAGE_EXT.has(extname(name).toLowerCase())) continue;
    // Les pictogrammes sont des icônes de réglure (un cercle, un fragment de lignes) :
    // lisibles à 24 px, absurdes en pleine largeur dans un carrousel.
    if (/^picto\b/.test(plain(name))) continue;
    await ingest(full);
  }
}

async function ingest(file: string) {
  const segments = relative(SRC, file).split(/[\\/]/).slice(0, -1);

  // Le chemin de page = le plus long préfixe qui résout dans l'arborescence du menu.
  let depth = segments.length;
  while (depth > 0 && !findByPath(segments.slice(0, depth))) depth--;
  if (depth === 0) {
    console.warn(`  ! hors arborescence, ignoré : ${relative(SRC, file)}`);
    return;
  }

  const placed = place(file, segments.slice(0, depth).join("/"), segments.slice(depth));
  if (!placed) return; // Référence non résolue, déjà consignée dans `unplaced`.
  const { navPath, variant, caption, rank, pages } = placed;

  const bytes = readFileSync(file);
  const signature = `${navPath}:${createHash("sha1").update(bytes).digest("hex")}`;
  let src = bySignature.get(signature);

  if (!src) {
    const outDir = join(PUBLIC_DIR, ...navPath.split("/"), variant || "_");
    const base = slugify(basename(file, extname(file)));
    // Deux noms sources différents peuvent produire le même slug : on suffixe.
    let outName = `${base}.webp`;
    for (let i = 2; written.has(join(outDir, outName)); i++) outName = `${base}-${i}.webp`;
    written.add(join(outDir, outName));
    mkdirSync(outDir, { recursive: true });
    const buffer = await sharp(bytes)
      .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();
    writeFileSync(join(outDir, outName), buffer);
    src = `/catalogue/${navPath}/${variant || "_"}/${outName}`;
    bySignature.set(signature, src);
    converted++;
  }

  entries.push({ navPath, variant, src, caption, rank, pages });
}

/* ------------------------------ Écriture du manifeste ----------------------- */

const bi = (b: Bi) => `{ fr: ${JSON.stringify(b.fr)}, en: ${JSON.stringify(b.en)} }`;

function writeManifest() {
  const byPath = new Map<string, Map<string, Entry[]>>();
  for (const e of entries) {
    const variants = byPath.get(e.navPath) ?? new Map<string, Entry[]>();
    const list = variants.get(e.variant) ?? [];
    list.push(e);
    variants.set(e.variant, list);
    byPath.set(e.navPath, variants);
  }

  const lines: string[] = [
    "/**",
    " * FICHIER GÉNÉRÉ — ne pas éditer à la main.",
    " * Source : scripts/ingest-catalogue-images.mts (voir l'en-tête du script).",
    " */",
    'import type { CatalogueImage } from "./catalogue-images";',
    "",
    "export const catalogueImages: Record<string, Record<string, CatalogueImage[]>> = {",
  ];

  for (const navPath of [...byPath.keys()].sort()) {
    lines.push(`  ${JSON.stringify(navPath)}: {`);
    const variants = byPath.get(navPath)!;
    for (const variant of [...variants.keys()].sort()) {
      // Un même visuel peut venir de deux dossiers sources (une référence rangée à la
      // fois sous sa gamme et sous « Cahiers Spécialisés ») : une seule entrée suffit.
      const seen = new Set<string>();
      const list = variants
        .get(variant)!
        .sort((a, b) => a.rank - b.rank || a.pages - b.pages || a.src.localeCompare(b.src))
        .filter((e) => !seen.has(e.src) && seen.add(e.src));
      lines.push(`    ${JSON.stringify(variant)}: [`);
      for (const e of list) {
        const caption = e.caption ? `, caption: ${bi(e.caption)}` : "";
        // Le rang voyage jusqu'au rendu : c'est lui qui ordonne le carrousel une fois
        // les visuels communs et ceux de la taille réunis (cf. imagesFor).
        lines.push(`      { src: ${JSON.stringify(e.src)}${caption}, rank: ${e.rank} },`);
      }
      lines.push("    ],");
    }
    lines.push("  },");
  }

  lines.push("};", "");
  writeFileSync(MANIFEST, lines.join("\n"), "utf8");
}

/* ----------------------------------- Main ---------------------------------- */

console.log(`Source : ${SRC}`);
rmSync(PUBLIC_DIR, { recursive: true, force: true });
await walk(SRC);
writeManifest();

const pages = new Set(entries.map((e) => e.navPath));
console.log(`${entries.length} visuels sur ${pages.size} pages — ${converted} fichiers écrits dans public/catalogue`);
console.log(`Manifeste : ${relative(PROJECT, MANIFEST)}`);

if (unplaced.length > 0) {
  console.log(`\n${unplaced.length} visuel(s) non placé(s) — à régler à la source (lsiting_articles_complet.xlsx) :`);
  for (const line of [...new Set(unplaced)].sort()) console.log(`  ! ${line}`);
}
