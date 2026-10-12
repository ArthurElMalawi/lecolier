"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Download, ImageOff, Loader2, X } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import {
  FICHE_LABELS, LOG_COLUMNS, ficheLogCell, ficheLogRows, ficheSections, type FicheProduit,
} from "@/lib/fiches";

/** Badge de référence cliquable : ouvre la fiche produit en modale. */
export function FicheRefButton({ code, fiche, lang, children }: {
  code: string; fiche: FicheProduit; lang: Lang; children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer rounded-md transition hover:brightness-95 hover:ring-2 hover:ring-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
        aria-label={`${FICHE_LABELS[lang].sheet} ${code}`}
      >
        {children}
      </button>
      {open && <FicheModal code={code} fiche={fiche} lang={lang} onClose={() => setOpen(false)} />}
    </>
  );
}

function FicheModal({ code, fiche, lang, onClose }: {
  code: string; fiche: FicheProduit; lang: Lang; onClose: () => void;
}) {
  const L = FICHE_LABELS[lang];
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  const download = async () => {
    setBusy(true);
    try {
      const { downloadFichePdf } = await import("@/lib/fiche-pdf");
      await downloadFichePdf(code, fiche, lang);
    } finally {
      setBusy(false);
    }
  };

  const logRows = ficheLogRows(fiche);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="fiche-title"
        className="relative flex max-h-[100dvh] w-full flex-col overflow-hidden bg-white text-left shadow-2xl dark:bg-zinc-950 sm:max-h-[90vh] sm:max-w-4xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex items-start gap-4 border-b border-black/[.06] px-5 py-4 dark:border-white/[.08] sm:px-6">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {L.sheet} · <span className="tabular-nums text-green-700 dark:text-green-400">{code}</span>
            </p>
            <h2 id="fiche-title" className="mt-1 text-sm font-semibold leading-snug text-zinc-900 dark:text-zinc-100 sm:text-base">
              {fiche.designation}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={L.close}
            className="-mr-2 rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Corps */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-50 dark:bg-zinc-900">
              {fiche.image ? (
                <Image src={fiche.image} alt={fiche.designation} fill sizes="(min-width: 768px) 320px, 90vw" className="object-contain p-6" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-zinc-300 dark:text-zinc-600">
                  <ImageOff className="h-12 w-12" strokeWidth={1.25} />
                  <span className="text-xs font-medium uppercase tracking-wide">{L.noImage}</span>
                </div>
              )}
            </div>

            <div className="min-w-0 space-y-6">
              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">{L.features}</h3>
                <dl className="divide-y divide-black/[.05] text-sm dark:divide-white/[.06]">
                  {ficheSections(fiche, lang).map((sec) => (
                    <div key={sec.title} className="grid grid-cols-[7rem_minmax(0,1fr)] gap-x-3 py-2">
                      <dt className="font-medium text-zinc-900 dark:text-zinc-100">{sec.title}</dt>
                      <dd className="space-y-1">
                        {sec.rows.map((r, i) => (
                          <div key={i} className="flex flex-wrap gap-x-2">
                            {r.label && <span className="text-zinc-500">{r.label}{lang === "fr" ? " :" : ":"}</span>}
                            <span className="text-zinc-800 dark:text-zinc-200">{r.value}</span>
                          </div>
                        ))}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              {logRows.length > 0 && (
                <section>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">{L.logistics}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[26rem] text-sm">
                      <thead>
                        <tr className="border-b border-black/[.06] dark:border-white/[.08]">
                          <th />
                          {LOG_COLUMNS.map((c) => (
                            <th key={c} className="px-2 py-2 text-center font-medium text-zinc-500">{L.columns[c]}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/[.04] dark:divide-white/[.05]">
                        {logRows.map((k) => (
                          <tr key={k}>
                            <td className="py-2 pr-2 font-medium text-zinc-900 dark:text-zinc-100">{L.log[k]}</td>
                            {LOG_COLUMNS.map((c) => (
                              <td key={c} className="px-2 py-2 text-center tabular-nums text-zinc-700 dark:text-zinc-300">
                                {ficheLogCell(fiche, c, k, lang) ?? <span className="text-zinc-300 dark:text-zinc-600">—</span>}
                              </td>
                            ))}
                          </tr>
                        ))}
                        {fiche.hsCode && (
                          <tr>
                            <td className="py-2 pr-2 font-medium text-zinc-900 dark:text-zinc-100">{L.log.hsCode}</td>
                            <td className="px-2 py-2 text-center tabular-nums text-zinc-700 dark:text-zinc-300">{fiche.hsCode}</td>
                            <td colSpan={2} />
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>

        {/* Pied : téléchargement */}
        <div className="flex justify-end border-t border-black/[.06] px-5 py-3 dark:border-white/[.08] sm:px-6">
          <button
            type="button"
            onClick={download}
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 sm:w-auto"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {busy ? L.generating : L.download}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
