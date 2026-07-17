import type { Lang } from "@/lib/i18n";
import type { Bi, RefTableData } from "@/lib/classement-refs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/** Pastille (carré) par nom de couleur. Les couleurs sont TOUJOURS rendues en pastille, jamais en toutes lettres. */
export const COLOR_STYLE: Record<string, string> = {
  Orange: "bg-orange-500",
  Gris: "bg-gray-500",
  Jaune: "bg-yellow-400",
  Rose: "bg-pink-400",
  Violet: "bg-purple-500",
  Bleu: "bg-blue-500",
  Rouge: "bg-red-500",
  Vert: "bg-green-500",
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
  Rouge: "Red",
  Vert: "Green",
  Noir: "Black",
  Incolore: "Clear",
  Assortit: "Assorted",
};

function Swatch({ color, lang }: { color: string; lang: Lang }) {
  const style = COLOR_STYLE[color] ?? "bg-zinc-200";
  const name = lang === "en" ? COLOR_EN[color] ?? color : color;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`h-6 w-6 rounded ${style}`} aria-label={name} />
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-white text-black dark:bg-zinc-950 dark:text-white">
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Tableau de références normalisé (carte zinc-50/50, sans bordure/ombre).
 * Une ligne porte une couleur (pastille) et/ou un libellé texte (dimension, réglure…) ;
 * la colonne correspondante n'apparaît que si au moins une ligne la renseigne.
 * Les colonnes et lignes entièrement vides sont masquées.
 */
export function RefTable({ data, lang }: { data: RefTableData; lang: Lang }) {
  const L = (b: Bi) => (lang === "en" ? b.en : b.fr);

  const colVisible = data.columns.map((_, i) => data.rows.some((r) => r.cells[i]));
  const columns = data.columns.filter((_, i) => colVisible[i]);
  const rows = data.rows
    .filter((r) => r.cells.some((c) => c))
    .map((r) => ({ ...r, cells: r.cells.filter((_, i) => colVisible[i]) }));

  const hasSwatch = rows.some((r) => r.color);
  const hasLabel = rows.some((r) => r.label && (r.label.fr || r.label.en));

  return (
    <div className="overflow-x-auto rounded-lg border-none bg-zinc-50/50 p-4 shadow-none dark:bg-zinc-900/50 sm:p-6">
      <table className="w-full min-w-[30rem] text-sm">
        <thead>
          <tr className="border-b border-black/[.06] dark:border-white/[.08]">
            {hasSwatch && <th className="p-3" />}
            {hasLabel && <th className="p-3" />}
            {columns.map((c) => (
              <th key={c.fr} className="p-3 text-center font-medium text-zinc-500">
                {L(c)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr
              key={`${r.color ?? ""}|${r.label?.fr ?? ""}|${ri}`}
              className="border-b border-black/[.04] last:border-0 dark:border-white/[.05]"
            >
              {hasSwatch && <td className="p-3">{r.color && <Swatch color={r.color} lang={lang} />}</td>}
              {hasLabel && (
                <td className="whitespace-nowrap p-3 font-medium text-zinc-700 dark:text-zinc-300">
                  {r.label ? L(r.label) : null}
                </td>
              )}
              {r.cells.map((cell, i) => (
                <td key={i} className="p-2 text-center">
                  {cell ? (
                    <span className="inline-block rounded-md border border-green-200 bg-green-50 px-2.5 py-1 text-[13px] font-semibold tabular-nums text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300">
                      {cell}
                    </span>
                  ) : (
                    <span className="text-zinc-300 dark:text-zinc-600">—</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
