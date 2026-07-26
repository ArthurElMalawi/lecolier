/**
 * Recherche du catalogue — par nom de produit ET par numéro de référence (SKU).
 *
 * L'index est construit une fois au chargement du module, à partir des mêmes
 * sources que les pages : l'arborescence (lib/navigation), les références des
 * cahiers (lib/product-refs) et les fiches (lib/usage-sheets, lib/classement-refs).
 * Une entrée = une page réellement atteignable ; ses `refs` sont les SKU qu'elle
 * affiche. Chercher une référence renvoie donc toujours vers une page qui la montre.
 *
 * Rien n'est saisi ici : ajouter un produit à l'arborescence ou une référence à
 * l'export Excel suffit à le rendre trouvable.
 */
import type { Lang } from "./i18n";
import type { Bi, ProductSheet } from "./classement-refs";
import type { CoverType, Format } from "./catalog-types";
import { navTree, type NavNode } from "./navigation";
import { availableFor, refFor } from "./product-refs";
import { familyLabel, formatLabel, parseFamilyKey, rulingLabel } from "./catalog";
import { sheetFor, groupedPages } from "./usage-sheets";
import { imagesForPages, heroFor, hasImages } from "./catalogue-images";
import { colorLabel } from "./colors";
import { MIN_REF_DIGITS } from "./search-query";

/** Une référence indexée, avec sa précision d'affichage (coloris, pagination…). */
type IndexedRef = { ref: string } & Bi;

type SearchEntry = {
  /** Lien de la page, sans `?lang=` (ajouté à l'affichage). */
  href: string;
  title: Bi;
  /** Fil d'ariane des parents, pour distinguer deux pages de même nom. */
  context: Bi;
  icon?: string;
  thumb?: string;
  soon: boolean;
  refs: IndexedRef[];
};

export type SearchHit = {
  href: string;
  title: string;
  context: string;
  icon?: string;
  thumb?: string;
  soon: boolean;
  /** Références de la page correspondant à la requête (les plus pertinentes d'abord). */
  matched: { ref: string; detail: string }[];
  /** Nombre total de références présentées par la page. */
  refCount: number;
};

/* -------------------------------------------------------------------------- */
/*  Construction de l'index                                                     */
/* -------------------------------------------------------------------------- */

const FORMATS: Format[] = ["F17x22", "F21x29_7", "F24x32"];
const FORMAT_SLUG: Record<Format, string> = { F17x22: "17x22", F21x29_7: "21x29_7", F24x32: "24x32" };

const bi = (fn: (lang: Lang) => string): Bi => ({ fr: fn("fr"), en: fn("en") });

/** Références d'une fiche, chaque cellule précisée par sa ligne et sa colonne. */
function sheetRefs(sheet: ProductSheet): IndexedRef[] {
  const out: IndexedRef[] = [];
  for (const { table } of sheet) {
    for (const row of table.rows) {
      row.cells.forEach((cell, i) => {
        if (!cell) return;
        const column = table.columns[i];
        out.push({
          ref: cell,
          ...bi((lang) =>
            [row.color && colorLabel(row.color, lang), row.label?.[lang], column?.[lang]]
              .filter(Boolean)
              .join(" · "),
          ),
        });
      });
    }
  }
  return out;
}

/**
 * Fiches format d'une gamme (/product/…), telles que la page de gamme les liste :
 * un format Seyès par taille disponible, plus le 24×32 en 5×5 le cas échéant.
 */
function familyEntries(node: NavNode, trail: NavNode[]): SearchEntry[] {
  const family = node.family!;
  const parsed = parseFamilyKey(family);
  if (!parsed) return [];

  const coverType: CoverType = parsed.cover;
  const cover = parsed.cover === "CARTONNE" ? "CARTONNE" : "PP";
  const navPath = trail.map((n) => n.slug).join("/");
  const context = bi((lang) => trail.map((n) => (lang === "en" ? n.en : n.fr)).join(" › "));

  const entry = (format: Format, quadri: boolean): SearchEntry | null => {
    const ruling = quadri ? "QUADRI" : "SEYES";
    const { colors, pages } = availableFor({ grammageGsm: parsed.grammage, cover, format, ruling });
    if (pages.length === 0) return null;

    const refs: IndexedRef[] = [];
    for (const color of colors) {
      for (const p of pages) {
        const ref = refFor({ grammageGsm: parsed.grammage, cover, format, ruling, color, pages: p });
        if (ref) refs.push({ ref, ...bi((lang) => `${colorLabel(color, lang)} · ${p} pages`) });
      }
    }

    const variant = `${FORMAT_SLUG[format]}${quadri ? "-5x5" : ""}`;
    return {
      href: `/product/cahier-${family}-${variant}`,
      // Même intitulé que la fiche elle-même (app/product/[slug]/page.tsx).
      title: bi((lang) => {
        const name = rulingLabel(ruling, lang);
        const suffix = name && name !== "—" ? ` — ${name}` : "";
        return `${familyLabel({ grammageGsm: parsed.grammage, coverType }, lang)} ${formatLabel(format, lang)}${suffix}`;
      }),
      context,
      icon: node.icon,
      thumb: heroFor(navPath, variant)?.src,
      soon: false,
      refs,
    };
  };

  const entries = FORMATS.map((f) => entry(f, false));
  entries.push(entry("F24x32", true));
  return entries.filter((e): e is SearchEntry => e !== null);
}

function buildIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  const walk = (nodes: NavNode[], trail: NavNode[]) => {
    for (const node of nodes) {
      const here = [...trail, node];
      const path = here.map((n) => n.slug).join("/");
      const children = node.children ?? [];
      const sheet = children.length === 0 ? sheetFor(path, node.slug) : undefined;

      entries.push({
        href: node.path ?? `/c/${path}`,
        title: { fr: node.fr, en: node.en },
        context: bi((lang) => trail.map((n) => (lang === "en" ? n.en : n.fr)).join(" › ")),
        icon: node.icon,
        thumb: imagesForPages([path, ...groupedPages(path)])[0]?.src,
        // Une catégorie illustrée n'est plus « bientôt disponible » (cf. CategoryCard).
        soon: !!node.soon && !hasImages(path),
        refs: sheet ? sheetRefs(sheet) : [],
      });

      // Une gamme ne liste ses fiches format que faute de tableau propre (cf. /c/[...slug]).
      if (node.family && !sheet) entries.push(...familyEntries(node, here));
      if (children.length > 0) walk(children, here);
    }
  };

  walk(navTree, []);
  return entries;
}

const ENTRIES = buildIndex();

/* -------------------------------------------------------------------------- */
/*  Appariement                                                                 */
/* -------------------------------------------------------------------------- */

/** Minuscules, sans accents ni ponctuation — « 21 × 29,7 cm » → « 21 29 7 cm ». */
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** Même chaîne sans les espaces, pour que « 17x22 » retrouve « 17 x 22 cm ». */
const tight = (s: string) => norm(s).replace(/ /g, "");

type Doc = { entry: SearchEntry; title: string; titleTight: string; hay: string; hayTight: string };

function prepare(lang: Lang): Doc[] {
  return ENTRIES.map((entry) => {
    const title = norm(entry.title[lang]);
    const hay = `${title} ${norm(entry.context[lang])}`;
    return { entry, title, titleTight: tight(entry.title[lang]), hay, hayTight: tight(hay) };
  });
}

const DOCS: Record<Lang, Doc[]> = { fr: prepare("fr"), en: prepare("en") };

/** Poids d'un mot de la requête dans un document (0 = absent). */
function tokenScore(doc: Doc, token: string): number {
  if (doc.title.startsWith(token)) return 80;
  if (new RegExp(`\\b${token}`).test(doc.title)) return 60;
  if (doc.title.includes(token)) return 40;
  if (doc.titleTight.includes(token)) return 35;
  if (doc.hay.includes(token)) return 15;
  if (doc.hayTight.includes(token)) return 10;
  return 0;
}

/**
 * Recherche par nom ou par référence.
 *
 * Une requête numérique d'au moins `MIN_REF_DIGITS` chiffres est confrontée aux
 * références (égalité, puis début, puis fragment) ; les mots sont confrontés au
 * titre de la page puis à son fil d'ariane, et doivent tous correspondre.
 */
export function searchCatalogue(query: string, lang: Lang, limit = 8): SearchHit[] {
  const q = norm(query);
  if (q.length < 2) return [];

  const tokens = q.split(" ");
  const digits = query.replace(/\D/g, "");
  const scored: { hit: SearchHit; score: number }[] = [];

  for (const doc of DOCS[lang]) {
    let score = 0;
    const matched: { ref: string; detail: string; weight: number }[] = [];

    if (digits.length >= MIN_REF_DIGITS) {
      for (const r of doc.entry.refs) {
        const weight = r.ref === digits ? 1000 : r.ref.startsWith(digits) ? 600 : r.ref.includes(digits) ? 300 : 0;
        if (weight > 0) matched.push({ ref: r.ref, detail: r[lang], weight });
      }
      score += matched.reduce((max, m) => Math.max(max, m.weight), 0);
    }

    // Tous les mots doivent correspondre, sinon la page n'est pas un résultat.
    let text = 0;
    for (const token of tokens) {
      const s = tokenScore(doc, token);
      if (s === 0) {
        text = 0;
        break;
      }
      text += s;
    }
    if (text > 0) score += text + (doc.title.includes(q) ? 60 : 0);

    if (score === 0) continue;

    matched.sort((a, b) => b.weight - a.weight || a.ref.localeCompare(b.ref));
    scored.push({
      score,
      hit: {
        href: doc.entry.href,
        title: doc.entry.title[lang],
        context: doc.entry.context[lang],
        icon: doc.entry.icon,
        thumb: doc.entry.thumb,
        soon: doc.entry.soon,
        matched: matched.slice(0, 4).map(({ ref, detail }) => ({ ref, detail })),
        refCount: doc.entry.refs.length,
      },
    });
  }

  // À score égal, le titre le plus court est le plus précis.
  scored.sort((a, b) => b.score - a.score || a.hit.title.length - b.hit.title.length);
  return scored.slice(0, limit).map((s) => s.hit);
}
