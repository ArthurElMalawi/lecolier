import type { Lang } from "./i18n";

/**
 * Arborescence de navigation & de catalogue "L'écolier" (V2).
 *
 * Une seule source de vérité pilote : le méga-menu, les sections d'accueil et
 * toutes les pages catégorie/sous-catégorie via la route dynamique /c/[...slug].
 *
 * - `slug`   : segment d'URL (unique parmi les frères).
 * - `family` : clé de famille produit réelle (voir lib/catalog.ts).
 * - `path`   : lien interne direct hors arbo (ex. /qui-sommes-nous).
 * - `soon`   : catégorie prévue mais sans produits pour l'instant.
 * - `phare`  : produit phare (mise en avant).
 * - `icon`   : clé d'icône (voir lib/nav-icons.tsx).
 * - `desc`   : description courte affichée sur les cartes / sections.
 * - `note`   : accroche facultative.
 */
export type NavNode = {
  slug: string;
  fr: string;
  en: string;
  family?: string;
  path?: string;
  soon?: boolean;
  phare?: boolean;
  icon?: string;
  image?: string;
  desc?: { fr: string; en: string };
  note?: { fr: string; en: string };
  children?: NavNode[];
};

// Usages d'une gamme. Seul « Cahiers » pointe vers les produits (family) ; les
// autres usages (TP, Dessin, Maternelle) ont leurs propres références et sont
// rendus en fiche produit via classementSheets (clé = chemin complet), ou
// « Bientôt disponible » tant que la fiche n'existe pas.
const usages = (family: string): NavNode[] => [
  { slug: "cahiers", fr: "Cahiers", en: "Notebooks", icon: "notebook", family, desc: { fr: "Le cahier du quotidien, réglure Seyès.", en: "Everyday notebook, Seyès ruling." } },
  { slug: "travaux-pratiques", fr: "Travaux Pratiques (TP)", en: "Practical Work (Lab)", icon: "flask", desc: { fr: "Une page unie, une page lignée.", en: "One plain page, one lined page." } },
  { slug: "dessin-musique-chant", fr: "Dessin & Musique et Chant", en: "Drawing & Music", icon: "music", desc: { fr: "Pages dédiées au dessin et au solfège.", en: "Pages for drawing and music." } },
  { slug: "maternelle-petite-ecole", fr: "Maternelle / Petite École (Double lignes)", en: "Preschool / Early Years (Double-lined)", icon: "baby", desc: { fr: "Double lignes pour les premiers tracés.", en: "Double lines for early writing." } },
];

export const navTree: NavNode[] = [
  {
    slug: "nos-cahiers",
    fr: "Nos Cahiers",
    en: "Our Notebooks",
    icon: "notebook",
    desc: {
      fr: "Le cœur de L'écolier : des cahiers robustes en polypropylène et cartonnés, pensés pour durer toute l'année.",
      en: "L'écolier's core: tough polypro and hardcover notebooks built to last the whole year.",
    },
    children: [
      {
        slug: "gamme-polypro-premium",
        fr: "Gamme Polypro Premium (Papier 90g/m²)",
        en: "Polypro Premium Range (90gsm Paper)",
        phare: true,
        icon: "sparkles",
        desc: { fr: "Papier 90g/m² ultra-blanc, couverture polypro 300 microns.", en: "Ultra-white 90gsm paper, 300-micron polypro cover." },
        children: usages("90g-polypro-pique"),
      },
      {
        slug: "gamme-polypro-classique",
        fr: "Gamme Polypro Classique (Papier 70g/m²)",
        en: "Polypro Classic Range (70gsm Paper)",
        icon: "notebook",
        desc: { fr: "Le rapport qualité/prix, papier 70g/m² et couverture polypro.", en: "Best value, 70gsm paper with polypro cover." },
        children: usages("70g-polypro-pique"),
      },
      {
        slug: "gamme-cartonnee-plume",
        fr: "Gamme Cartonnées Plume (56g/m²)",
        en: "Plume Hardcover Range (56gsm)",
        icon: "book",
        desc: { fr: "Léger et économique, papier 56g/m².", en: "Light and economical, 56gsm paper." },
        children: [
          {
            slug: "gamme-plume",
            fr: "Gamme Plume (Papier 56g/m² - sans couverture ou cartonnée)",
            en: "Plume Range (56gsm Paper – softcover or hardcover)",
            family: "58g-cartonne",
            icon: "book",
            desc: {
              fr: "Cahiers assortis Seyès, papier 56g/m². Couverture papier couché 157g (32-48 p.) ou cartonnée vernie UV 230g (96-288 p.).",
              en: "Assorted Seyès notebooks, 56gsm paper. Coated paper cover 157g (32-48 p.) or UV-varnished hardcover 230g (96-288 p.).",
            },
          },
        ],
      },
      {
        slug: "cahiers-specialises",
        fr: "Cahiers Spécialisés (Petite École, TP, Dessin et Musique)",
        en: "Specialized Notebooks (Early Years, Lab, Drawing & Music)",
        icon: "layers",
        desc: { fr: "Des cahiers pensés pour chaque usage scolaire.", en: "Notebooks tailored to each school use." },
        children: [
          {
            slug: "travaux-pratiques",
            fr: "Travaux Pratiques (TP)",
            en: "Practical Work (Lab)",
            icon: "flask",
            desc: {
              fr: "Couverture polypro 300 microns (3/10ème), piqûres, Seyès. Garantie véritable papier à dessin.",
              en: "300-micron (3/10) polypro cover, stitched, Seyès. Genuine drawing paper guaranteed.",
            },
          },
          {
            slug: "dessin-musique-chant",
            fr: "Dessin & Musique et Chant",
            en: "Drawing & Music",
            icon: "music",
            desc: {
              fr: "Couverture polypro 300 microns (3/10ème) avec page de garde personnalisable, piqûres, Seyès. Garantie véritable papier dessin.",
              en: "300-micron (3/10) polypro cover with customizable title page, stitched, Seyès. Genuine drawing paper guaranteed.",
            },
          },
          {
            slug: "maternelle-petite-ecole",
            fr: "Maternelle / Petite École (Double lignes)",
            en: "Preschool / Early Years (Double-lined)",
            icon: "baby",
            desc: {
              fr: "Couverture polypro 300 microns (3/10ème) avec page de garde personnalisable, piqûres, double lignes 3 mm.",
              en: "300-micron (3/10) polypro cover with customizable title page, stitched, 3 mm double lines.",
            },
          },
          {
            slug: "cahier-recherche",
            fr: "Cahier de Recherche",
            en: "Research Notebook",
            icon: "pencil",
            desc: {
              fr: "Format A4, papier 90 g/m², couverture polypro 300 microns (3/10ème), piqûres. Réglure Seyès ou papier uni, 5 coloris assortis.",
              en: "A4 format, 90gsm paper, 300-micron (3/10) polypro cover, stitched. Seyès ruling or plain paper, 5 assorted colours.",
            },
          },
        ],
      },
      {
        slug: "prises-de-notes-spirales",
        fr: "Prises de Notes et Spiralés",
        en: "Notepads & Spiral Notebooks",
        icon: "spiral",
        desc: { fr: "Cahiers spiralés et blocs pour prendre des notes.", en: "Spiral notebooks and pads for note-taking." },
        children: [
          {
            slug: "cahiers-spirales-8-sujets",
            fr: "Cahiers 80gr Spiralés 8 sujets",
            en: "80gsm 8-Subject Spiral Notebooks",
            icon: "spiral",
            desc: {
              fr: "Couverture polypro 700 microns, 8 intercalaires 400 microns, papier 80 g/m². Formats 17×22 et A4.",
              en: "700-micron polypro cover, 8 dividers at 400 microns, 80gsm paper. 17×22 and A4 formats.",
            },
          },
          {
            slug: "blocs-notes",
            fr: "Blocs Notes",
            en: "Notepads",
            icon: "notepad",
            desc: {
              fr: "Blocs notes A4 et A5, papier 70 g/m² (couverture 230 g) ou 55 g/m² (couverture 180 g).",
              en: "A4 and A5 notepads, 70gsm paper (230 g cover) or 55gsm (180 g cover).",
            },
          },
        ],
      },
    ],
  },
  {
    slug: "fournitures",
    fr: "Toutes nos Fournitures",
    en: "All our Supplies",
    icon: "supplies",
    desc: {
      fr: "Classement, écriture, traçage, découpe, collage et art créatif : toute la trousse de l'élève.",
      en: "Filing, writing, geometry, cutting, gluing and crafts: the full pencil case.",
    },
    children: [
      {
        slug: "classement",
        fr: "Classement (Feuillets Mobiles, Copies Doubles et Protège Cahiers)",
        en: "Filing (Loose-Leaf, Folded Sheets & Covers)",
        icon: "folder",
        desc: { fr: "Feuillets, copies doubles et protège-cahiers.", en: "Sheets, folded sheets and covers." },
        children: [
          {
            slug: "copies-doubles",
            fr: "Copies Doubles",
            en: "Folded Sheets",
            icon: "folder",
            desc: {
              fr: "Copies doubles papier 70g/m², perforées ou non, réglure Seyès ou 5×5. Formats 17×22 et 21×29,7 (A4).",
              en: "70gsm folded sheets, punched or not, Seyès or 5×5 ruling. 17×22 and 21×29.7 (A4) formats.",
            },
          },
          {
            slug: "feuillets-mobiles",
            fr: "Feuillets Mobiles",
            en: "Loose-Leaf Sheets",
            icon: "folder",
            desc: {
              fr: "Feuillets mobiles perforés, papier 70g/m², format 21×29,7 (A4). Réglure Seyès ou 5×5.",
              en: "Punched loose-leaf sheets, 70gsm paper, 21×29.7 (A4) format. Seyès or 5×5 ruling.",
            },
          },
          {
            slug: "proteges-cahiers",
            fr: "Protèges Cahiers (120 & 220 microns)",
            en: "Notebook Covers (120 & 220 microns)",
            icon: "shield",
            desc: {
              fr: "Protège-cahiers 17×22 grain cuir avec porte-étiquette, 22/100e. 12 coloris.",
              en: "17×22 leather-grain covers with label holder, 22/100. 12 colours.",
            },
          },
        ],
      },
      {
        slug: "ecriture-tracage",
        fr: "Ecriture et Traçage",
        en: "Writing & Geometry",
        icon: "ruler",
        desc: { fr: "Crayons, gommes, règles, équerres et compas.", en: "Pencils, erasers, rulers, squares and compasses." },
        children: [
          {
            slug: "kit-tracage",
            fr: "Kit de Traçage / Set Mathématique",
            en: "Geometry Set / Math Set",
            icon: "ruler",
            desc: {
              fr: "Kits 3, 4 et 5 pièces : règle 30 cm, équerres, rapporteur et compas.",
              en: "3, 4 and 5-piece sets: 30 cm ruler, squares, protractor and compass.",
            },
          },
          {
            slug: "regles-equerres-compas",
            fr: "Règle, Equerres, Rapporteurs et Compas",
            en: "Rulers, Squares, Protractors & Compasses",
            icon: "ruler",
            desc: {
              fr: "Compas plastique avec crayon, fixe ou réglable. Règles, équerres et rapporteurs sont proposés en kit de traçage.",
              en: "Plastic compass with pencil, fixed or adjustable. Rulers, squares and protractors come in the geometry sets.",
            },
          },
          {
            slug: "crayons-papier",
            fr: "Crayons à papier",
            en: "Graphite Pencils",
            icon: "pencil",
            desc: { fr: "Crayons HB n°2, corps bois ou plastique, en boîte de 10.", en: "HB #2 pencils, wooden or plastic body, in boxes of 10." },
          },
          {
            slug: "gommes",
            fr: "Gomme",
            en: "Erasers",
            icon: "eraser",
            desc: { fr: "Gommes blanches T20 et T30.", en: "T20 and T30 white erasers." },
          },
          {
            slug: "taille-crayons",
            fr: "Tailles Crayons",
            en: "Pencil Sharpeners",
            icon: "pencil",
            desc: { fr: "Taille-crayon 2 trous avec mini réservoir, et modèle Design.", en: "Two-hole sharpener with mini canister, and Design model." },
          },
        ],
      },
      {
        slug: "decoupe-collage",
        fr: "Découpe et Collage",
        en: "Cutting & Gluing",
        icon: "scissors",
        desc: { fr: "Colles et ciseaux adaptés à chaque âge.", en: "Glue and scissors for every age." },
        children: [
          {
            slug: "colle-baton",
            fr: "Colle en Bâton",
            en: "Glue Sticks",
            icon: "glue",
            desc: { fr: "Bâtons de colle 10, 20 et 40 g.", en: "10, 20 and 40 g glue sticks." },
          },
          { slug: "colle-blanche", fr: "Colle Blanche", en: "White Glue", icon: "glue", soon: true },
          { slug: "colle-transparente", fr: "Colle Transparente", en: "Clear Glue", icon: "glue", soon: true },
          // Une seule rubrique pour les trois tailles : elles se choisissent l'une par
          // rapport à l'autre, les séparer obligeait à ouvrir trois pages pour comparer.
          {
            slug: "ciseaux",
            fr: "Ciseaux",
            en: "Scissors",
            icon: "scissors",
            desc: {
              fr: "De la petite enfance au grand format : ciseaux plastique, 12 cm et 18 cm.",
              en: "From toddlers to older pupils: plastic, 12 cm and 18 cm scissors.",
            },
          },
        ],
      },
      {
        slug: "art-creatif",
        fr: "Art Créatif",
        en: "Creative Arts",
        icon: "palette",
        desc: { fr: "Papier à grain, crayons et feutres de couleurs.", en: "Textured paper, colored pencils and markers." },
        children: [
          {
            slug: "papier-dessin-grain",
            fr: "Papier à Dessin à Grain",
            en: "Textured Drawing Paper",
            icon: "palette",
            desc: {
              fr: "Pochettes de 12 feuilles de papier blanc à grain, 180 et 220 g/m², en 21 × 29,7 et 24 × 32 cm.",
              en: "Packs of 12 white textured sheets, 180 and 220 gsm, in 21 × 29.7 and 24 × 32 cm.",
            },
          },
          {
            slug: "crayons-couleurs",
            fr: "Crayons de couleurs",
            en: "Colored Pencils",
            icon: "palette",
            desc: {
              fr: "Crayons triangulaires 18 cm, bois ou plastique, en boîte de 12.",
              en: "18 cm triangular pencils, wooden or plastic, in boxes of 12.",
            },
          },
          {
            slug: "feutres",
            fr: "Feutres de Couleurs",
            en: "Felt-Tip Markers",
            icon: "palette",
            desc: { fr: "Boîte de 12 feutres pointe moyenne.", en: "Box of 12 medium-tip markers." },
          },
        ],
      },
    ],
  },
  {
    slug: "accessoires",
    fr: "Accessoires & Quotidien",
    en: "Accessories & Daily Life",
    icon: "accessories",
    desc: {
      fr: "Sacs à dos, trousses, agendas et gourdes pour accompagner l'élève au quotidien.",
      en: "Backpacks, pencil cases, diaries and bottles for everyday school life.",
    },
    children: [
      {
        slug: "sacs-trousses",
        fr: "Sacs à dos & Trousses",
        en: "Backpacks & Pencil Cases",
        icon: "backpack",
        desc: { fr: "Sacs à dos et trousses résistants.", en: "Sturdy backpacks and pencil cases." },
        children: [
          {
            slug: "sacs-a-dos",
            fr: "Sacs à Dos",
            en: "Backpacks",
            icon: "backpack",
            desc: { fr: "Sac à dos L'écolier, trois coloris.", en: "L'écolier backpack, three colours." },
          },
          {
            slug: "trousses",
            fr: "Trousses",
            en: "Pencil Cases",
            icon: "backpack",
            desc: { fr: "Trousse 2 zips en trois coloris, et modèle haut de gamme.", en: "Two-zip case in three colours, plus a premium model." },
          },
        ],
      },
      {
        slug: "agendas",
        fr: "Agendas Scolaires",
        en: "School Diaries",
        icon: "calendar",
        desc: { fr: "Pour organiser toute l'année scolaire.", en: "To organize the whole school year." },
        children: [{ slug: "agenda-rentree", fr: "Agenda Rentrée des Classes", en: "Back-to-School Diary", icon: "calendar", soon: true }],
      },
      {
        slug: "gourdes",
        fr: "Gourdes",
        en: "Water Bottles",
        icon: "bottle",
        desc: { fr: "Gourdes sans BPA, pour rester hydraté.", en: "BPA-free bottles to stay hydrated." },
        children: [
          {
            slug: "gourdes-bpa",
            fr: "Gourdes sans BPA",
            en: "BPA-Free Water Bottles",
            icon: "bottle",
            desc: {
              fr: "Gourde en plastique sans BPA, 500 ml, 4 couleurs assorties. Forme unique, usage alimentaire.",
              en: "BPA-free plastic bottle, 500 ml, 4 assorted colours. Distinctive shape, food-safe.",
            },
          },
        ],
      },
      {
        slug: "sacs-kraft-plv",
        fr: "Sacs Kraft & PLV",
        en: "Kraft Bags & POS",
        icon: "bag",
        desc: { fr: "Sacs kraft et supports de communication en point de vente.", en: "Kraft bags and point-of-sale material." },
        children: [
          {
            slug: "sacs-kraft",
            fr: "Sacs Kraft",
            en: "Kraft Bags",
            icon: "bag",
            desc: {
              fr: "Sacs kraft à poignées torsadées, logo L'écolier. Trois dimensions.",
              en: "Kraft bags with twisted handles, L'écolier logo. Three sizes.",
            },
          },
        ],
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                     */
/* -------------------------------------------------------------------------- */

export function nodeLabel(node: NavNode, lang: Lang): string {
  return lang === "en" ? node.en : node.fr;
}

export function nodeDesc(node: NavNode, lang: Lang): string | null {
  if (!node.desc) return null;
  return lang === "en" ? node.desc.en : node.desc.fr;
}

/** Lien de navigation d'un nœud dans l'arborescence de pages. */
export function nodeHref(trailSlugs: string[], node: NavNode, lang: Lang): string {
  if (node.path) return `${node.path}?lang=${lang}`;
  return `/c/${trailSlugs.join("/")}?lang=${lang}`;
}

export type Resolved = { node: NavNode; trail: NavNode[] };

/** Résout un chemin de slugs vers un nœud + sa lignée. */
export function findByPath(slugs: string[]): Resolved | null {
  let level = navTree;
  let node: NavNode | null = null;
  const trail: NavNode[] = [];
  for (const s of slugs) {
    const found = level.find((n) => n.slug === s);
    if (!found) return null;
    trail.push(found);
    node = found;
    level = found.children ?? [];
  }
  return node ? { node, trail } : null;
}

/** Retrouve la lignée (trail) menant à une famille produit dans l'arbre. */
export function findFamilyTrail(family: string): NavNode[] | null {
  let result: NavNode[] | null = null;
  const walk = (nodes: NavNode[], prefix: NavNode[]): boolean => {
    for (const n of nodes) {
      const trail = [...prefix, n];
      if (n.family === family) {
        result = trail;
        return true;
      }
      if (n.children && walk(n.children, trail)) return true;
    }
    return false;
  };
  walk(navTree, []);
  return result;
}
