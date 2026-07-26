import type { ReactNode } from "react";

import type { Lang } from "@/lib/i18n";
import type { RefTableData } from "@/lib/classement-refs";
import { RefTable } from "@/components/ref-table";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export type SheetSection = {
  /** Sous-titre de section — omis s'il n'apporte rien (évite les répétitions avec le titre). */
  title?: string | null;
  table: RefTableData;
};

/**
 * Mise en page commune à TOUTES les fiches produit (cahiers dérivés des
 * références comme fiches classement) : fil d'ariane, visuel à gauche,
 * titre + sections de tableaux à droite.
 */
export function ProductSheet({
  crumbs,
  title,
  description,
  image,
  sections,
  note,
  lang,
}: {
  crumbs: { label: string; href?: string }[];
  title: string;
  description?: string | null;
  image: ReactNode;
  sections: SheetSection[];
  /** Message affiché à la place des tableaux (références pas encore saisies). */
  note?: string | null;
  lang: Lang;
}) {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-10 lg:px-8">
      <Breadcrumb items={crumbs} />

      <div className="grid items-start gap-12 lg:grid-cols-2">
        {image}

        <div className="min-w-0 space-y-8">
          <div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              {title}
            </h1>
            {description && <p className="text-sm text-zinc-500">{description}</p>}
          </div>

          {sections.length === 0 && note && (
            <p className="rounded-lg bg-zinc-50 p-4 text-sm text-zinc-500 dark:bg-zinc-900/50">{note}</p>
          )}

          {sections.map((s, i) => (
            <section key={s.title || i} className="space-y-3">
              {s.title && (
                <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">{s.title}</h2>
              )}
              <RefTable data={s.table} lang={lang} />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
