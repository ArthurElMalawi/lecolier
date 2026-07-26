import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";

import { getLang } from "@/lib/i18n";
import { searchCatalogue } from "@/lib/search-index";
import { MIN_REF_DIGITS, isShortRefQuery } from "@/lib/search-query";
import { SearchBar } from "@/components/search-bar";
import { SearchResultRow } from "@/components/search-result";

export const metadata: Metadata = { title: "Recherche — L'écolier" };

type Search = { [key: string]: string | string[] | undefined };

const TEXT = {
  fr: {
    title: "Recherche",
    intro: "Cherchez un produit par son nom ou saisissez un numéro de référence.",
    results: (n: number) => `${n} résultat${n > 1 ? "s" : ""} pour`,
    empty: "Aucun résultat pour",
    hint: "Vérifiez l'orthographe, ou essayez un numéro de référence (par exemple 44519).",
    shortRef: `Une recherche par référence demande au moins ${MIN_REF_DIGITS} chiffres — « 445 » plutôt que « 44 ».`,
    browse: "Parcourir le catalogue",
  },
  en: {
    title: "Search",
    intro: "Search a product by name, or type a reference number.",
    results: (n: number) => `${n} result${n > 1 ? "s" : ""} for`,
    empty: "No results for",
    hint: "Check the spelling, or try a reference number (for example 44519).",
    shortRef: `Searching by reference needs at least ${MIN_REF_DIGITS} digits — “445” rather than “44”.`,
    browse: "Browse the catalogue",
  },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const lang = getLang(sp);
  const t = TEXT[lang];

  const query = typeof sp.q === "string" ? sp.q : "";
  const hits = searchCatalogue(query, lang, 40);

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-10 lg:px-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">{t.title}</h1>
        <p className="text-sm text-zinc-500">{t.intro}</p>
        <SearchBar lang={lang} initialQuery={query} />
      </div>

      {query.trim().length > 0 &&
        (hits.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-zinc-500">
              {t.results(hits.length)} <span className="font-semibold text-zinc-800">« {query.trim()} »</span>
            </p>
            <div className="space-y-3">
              {hits.map((hit, i) => (
                <SearchResultRow key={`${hit.href}-${i}`} hit={hit} lang={lang} />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-zinc-400 shadow-sm">
              <SearchX className="h-7 w-7" />
            </div>
            <p className="font-semibold text-zinc-800">
              {t.empty} « {query.trim()} »
            </p>
            <p className="mt-2 text-sm text-zinc-500">{isShortRefQuery(query) ? t.shortRef : t.hint}</p>
            <Link
              href={`/catalogue?lang=${lang}`}
              className="mt-6 inline-block text-sm font-semibold text-blue-600 hover:underline"
            >
              {t.browse} →
            </Link>
          </div>
        ))}
    </div>
  );
}
