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

/** Un produit d'une page qui en présente plusieurs : son visuel et ses références. */
export type SheetProduct = {
  key: string;
  image: ReactNode;
  title: string;
  description?: string | null;
  table: RefTableData;
};

/**
 * Mise en page commune à TOUTES les fiches produit (cahiers dérivés des
 * références comme fiches classement) : fil d'ariane, visuel à gauche,
 * titre + sections de tableaux à droite.
 *
 * Deux régimes, selon ce que la page montre :
 *   - un produit décliné  -> `image` + `sections` (le titre accompagne le visuel) ;
 *   - plusieurs produits  -> `products`, un bloc visuel + tableau chacun, sous un
 *     titre de page commun (ex. « Colle en Bâton » : 10 g, 20 g et 40 g).
 */
export function ProductSheet({
  crumbs,
  title,
  description,
  image,
  sections = [],
  products,
  note,
  lang,
}: {
  crumbs: { label: string; href?: string }[];
  title: string;
  description?: string | null;
  image?: ReactNode;
  sections?: SheetSection[];
  products?: SheetProduct[];
  /** Message affiché à la place des tableaux (références pas encore saisies). */
  note?: string | null;
  lang: Lang;
}) {
  if (products && products.length > 0) {
    return (
      <div className="mx-auto max-w-7xl space-y-10 px-6 py-10 lg:px-8">
        <Breadcrumb items={crumbs} />

        <div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            {title}
          </h1>
          {description && <p className="max-w-2xl text-sm text-zinc-500">{description}</p>}
        </div>

        <div className="space-y-10">
          {products.map((p) => (
            <section
              key={p.key}
              // Visuel plafonné : une page peut aligner trois produits, des carrés
              // pleine demi-largeur la rendraient interminable.
              className="grid items-start gap-8 border-t border-black/[.06] pt-10 first:border-0 first:pt-0 dark:border-white/[.08] lg:grid-cols-[minmax(0,20rem)_1fr]"
            >
              {p.image}

              <div className="min-w-0 space-y-3">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{p.title}</h2>
                {p.description && <p className="text-sm text-zinc-500">{p.description}</p>}
                <RefTable data={p.table} lang={lang} />
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

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
