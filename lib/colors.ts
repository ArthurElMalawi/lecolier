/**
 * Vocabulaire des coloris du catalogue.
 *
 * Les couleurs sont saisies en français dans les références (product-refs,
 * classement-refs). Ce module centralise leur pastille et leur traduction, pour
 * que les tableaux et la recherche parlent des mêmes coloris.
 */
import type { Lang } from "./i18n";

/** Pastille (carré) par nom de couleur. Les couleurs sont TOUJOURS rendues en pastille, jamais en toutes lettres. */
export const COLOR_STYLE: Record<string, string> = {
  Orange: "bg-orange-500",
  Gris: "bg-gray-500",
  Jaune: "bg-yellow-400",
  Rose: "bg-pink-400",
  Violet: "bg-purple-500",
  Bleu: "bg-blue-500",
  "Bleu clair": "bg-sky-300",
  Rouge: "bg-red-500",
  Vert: "bg-green-500",
  "Vert clair": "bg-lime-400",
  Brun: "bg-amber-800",
  Noir: "bg-black",
  Incolore: "bg-transparent border border-zinc-300 dark:border-zinc-600",
  Assortit: "bg-gradient-to-r from-blue-400 via-red-400 to-yellow-400",
};

const COLOR_EN: Record<string, string> = {
  Orange: "Orange",
  Gris: "Grey",
  Jaune: "Yellow",
  Rose: "Pink",
  Violet: "Purple",
  Bleu: "Blue",
  "Bleu clair": "Light blue",
  Rouge: "Red",
  Vert: "Green",
  "Vert clair": "Light green",
  Brun: "Brown",
  Noir: "Black",
  Incolore: "Clear",
  Assortit: "Assorted",
};

/** Nom lisible d'un coloris (le nom français fait foi quand la traduction manque). */
export function colorLabel(color: string, lang: Lang): string {
  return lang === "en" ? COLOR_EN[color] ?? color : color;
}
