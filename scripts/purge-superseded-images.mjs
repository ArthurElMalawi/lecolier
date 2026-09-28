/**
 * Retire du dossier source les anciens visuels que le nouveau lot remplace.
 *
 *   node scripts/purge-superseded-images.mjs [--apply]
 *
 * Rien n'est supprimé : les fichiers sont déplacés dans un dossier daté, à côté de la
 * source. Sans --apply, le script n'affiche que ce qu'il ferait, avec la raison.
 *
 * Un ancien visuel n'est retiré que si le nouveau lot le remplace réellement — un
 * visuel unique (vue de format sans coloris, photo de réglure à la loupe, coloris
 * assortis) est conservé même si sa page a reçu de nouvelles photos.
 */
import { readdirSync, statSync, readFileSync, mkdirSync, renameSync } from "node:fs";
import { join, relative, dirname, basename } from "node:path";
import { createHash } from "node:crypto";

const ROOT = "C:/Users/arthu/Pictures/lecolier/catalogue-v1";
const BATCH = "C:/Users/arthu/Downloads/Photo des produits-20260928T082110Z-1-001";
const TRASH = "C:/Users/arthu/Pictures/lecolier/_supprimes-2026-09-28";
const APPLY = process.argv.includes("--apply");

const SEP = /[\\/]/;

const walk = (dir, out = []) => {
  for (const name of readdirSync(dir).sort()) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(png|jpe?g|webp)$/i.test(name)) out.push(full);
  }
  return out;
};

const sha = (file) => createHash("sha1").update(readFileSync(file)).digest("hex");

/** Certains noms sont passés par une console CP437 : on compare sur l'ASCII qui reste. */
const plain = (s) => s.replace(/[^\x20-\x7e]/g, "").toLowerCase();

const batch = walk(BATCH);
const batchNames = new Set(batch.map((f) => basename(f)));
const batchHashes = new Map(batch.map((f) => [sha(f), basename(f)]));

/** Captures du catalogue papier, sur des pages qui ont désormais de vraies photos. */
const SCREENSHOT_PAGES = [
  "nos-cahiers/gamme-polypro-premium/travaux-pratiques",
  "nos-cahiers/gamme-polypro-premium/dessin-musique-chant",
  "nos-cahiers/gamme-polypro-premium/maternelle-petite-ecole",
  "nos-cahiers/gamme-polypro-classique/travaux-pratiques",
];

/** Pourquoi cet ancien visuel est remplacé, ou null s'il faut le garder. */
function supersededBy(dir, name, file) {
  const twin = batchHashes.get(sha(file));
  if (twin) return `doublon au bit près de ${twin}`;

  if (dir === "accessoires/gourdes/gourdes-bpa")
    return "vignette basse définition (351 × 263) remplacée par les photos 3648 × 2736";

  if (name.startsWith("capture") && SCREENSHOT_PAGES.includes(dir))
    return "capture du catalogue papier, page désormais photographiée";

  if (dir === "nos-cahiers/gamme-polypro-classique/cahiers/toutes-tailles-seyes")
    return "contenu 90 g rangé sous la gamme 70 g — l'original reste sous premium";

  if (dir === "nos-cahiers/gamme-polypro-premium/cahiers/toute-tailles") {
    if (name.includes("page de garde")) return "détourage sale (fond bleu), remplacé par bleu_Page de garde.png";
    // « Réglure+ » est une photo de cahier ouvert à la loupe : rien ne la remplace.
    if (name.includes("glure") && !name.includes("+")) return "même schéma que Reglure Seyes.png du nouveau lot";
  }

  return null;
}

const moves = [];
const kept = [];
for (const file of walk(ROOT)) {
  if (batchNames.has(basename(file))) continue; // vient du nouveau lot
  const rel = relative(ROOT, file).split(SEP).join("/");
  const why = supersededBy(dirname(rel), plain(basename(file)), file);
  if (why) moves.push([rel, why]);
  else kept.push(rel);
}

if (process.argv.includes("--kept")) {
  console.log(`${kept.length} anciens visuels conservés (rien ne les remplace) :\n`);
  for (const rel of kept) console.log(`  ${rel}`);
  process.exit(0);
}

console.log(`${moves.length} anciens visuels remplacés :\n`);
let lastDir = "";
for (const [rel, why] of moves) {
  const dir = dirname(rel);
  if (dir !== lastDir) {
    console.log(`  ${dir}/`);
    lastDir = dir;
  }
  console.log(`      ${basename(rel)}`);
  console.log(`          → ${why}`);
}

if (!APPLY) {
  console.log("\nSimulation — relancer avec --apply pour déplacer.");
} else {
  for (const [rel] of moves) {
    const to = join(TRASH, rel);
    mkdirSync(dirname(to), { recursive: true });
    renameSync(join(ROOT, rel), to);
  }
  console.log(`\nDéplacés vers ${TRASH}`);
}
