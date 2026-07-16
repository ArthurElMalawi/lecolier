import type { Lang } from "@/lib/i18n";
import type { RefTableData } from "@/lib/classement-refs";

/** Tableau de références normalisé (carte zinc-50/50, sans bordure/ombre). */
export function RefTable({ data, lang }: { data: RefTableData; lang: Lang }) {
  const L = (b: { fr: string; en: string }) => (lang === "en" ? b.en : b.fr);

  // On masque les colonnes et lignes entièrement vides
  const colVisible = data.columns.map((_, i) => data.rows.some((r) => r.cells[i]));
  const columns = data.columns.filter((_, i) => colVisible[i]);
  const rows = data.rows
    .filter((r) => r.cells.some((c) => c))
    .map((r) => ({ ...r, cells: r.cells.filter((_, i) => colVisible[i]) }));

  return (
    <div className="overflow-x-auto rounded-lg border-none bg-zinc-50/50 p-4 shadow-none dark:bg-zinc-900/50 sm:p-6">
      <table className="w-full min-w-[30rem] text-sm">
        <thead>
          <tr className="border-b border-black/[.06] dark:border-white/[.08]">
            <th className="p-3 text-left font-medium text-zinc-500"></th>
            {columns.map((c) => (
              <th key={c.fr} className="p-3 text-center font-medium text-zinc-500">
                {L(c)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label.fr} className="border-b border-black/[.04] last:border-0 dark:border-white/[.05]">
              <td className="whitespace-nowrap p-3 font-medium text-zinc-700 dark:text-zinc-300">{L(r.label)}</td>
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
