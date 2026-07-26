"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/i18n";
import type { SearchHit } from "@/lib/search-index";
import { MIN_REF_DIGITS, isShortRefQuery } from "@/lib/search-query";
import { SearchResultRow } from "@/components/search-result";

const TEXT = {
  fr: {
    placeholder: "Rechercher un produit ou une référence…",
    label: "Rechercher dans le catalogue",
    clear: "Effacer la recherche",
    empty: "Aucun résultat",
    shortRef: `Saisissez au moins ${MIN_REF_DIGITS} chiffres d'une référence`,
    all: "Voir tous les résultats",
  },
  en: {
    placeholder: "Search a product or a reference…",
    label: "Search the catalogue",
    clear: "Clear search",
    empty: "No results",
    shortRef: `Type at least ${MIN_REF_DIGITS} digits of a reference`,
    all: "See all results",
  },
} satisfies Record<Lang, Record<string, string>>;

/**
 * Barre de recherche par nom de produit ou numéro de référence.
 *
 * Les suggestions viennent de /api/search : l'index reste côté serveur, seule la
 * poignée de résultats affichés transite. Entrée sans sélection ouvre /recherche.
 *
 * - `header` : suggestions en surcouche sous le champ (barre du haut).
 * - `drawer` : suggestions dans le flux, pour un conteneur qui défile (menu mobile).
 */
export function SearchBar({
  lang,
  variant = "header",
  initialQuery = "",
  onNavigate,
  className,
}: {
  lang: Lang;
  variant?: "header" | "drawer";
  /** Requête déjà affichée (page /recherche). */
  initialQuery?: string;
  onNavigate?: () => void;
  className?: string;
}) {
  const t = TEXT[lang];
  const router = useRouter();
  const listId = useId();
  const wrapper = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState(initialQuery);
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  // Suggestions, avec un délai pour ne pas interroger à chaque frappe.
  // Rien n'est demandé tant que le champ n'a pas le focus (page /recherche pré-remplie).
  useEffect(() => {
    const q = query.trim();
    if (!open || q.length < 2) {
      setHits([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&lang=${lang}`, { signal: controller.signal });
        const data: { hits?: SearchHit[] } = await res.json();
        if (cancelled) return;
        setHits(data.hits ?? []);
        setActive(-1);
      } catch {
        // Requête annulée ou réseau indisponible : on garde les résultats précédents.
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 180);

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, lang, open]);

  // Fermeture au clic hors du champ (surcouche uniquement).
  useEffect(() => {
    if (variant !== "header" || !open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [variant, open]);

  // La requête reste affichée après navigation : la page /recherche la conserve aussi.
  const select = () => {
    setOpen(false);
    onNavigate?.();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (active >= 0 && hits[active]) {
      router.push(`${hits[active].href}?lang=${lang}`);
      select();
      return;
    }
    if (q.length < 2) return;
    router.push(`/recherche?q=${encodeURIComponent(q)}&lang=${lang}`);
    select();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      input.current?.blur();
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (hits.length === 0) return;
      e.preventDefault();
      setOpen(true);
      setActive((i) => {
        const next = e.key === "ArrowDown" ? i + 1 : i - 1;
        return (next + hits.length) % hits.length;
      });
    }
  };

  const showList = open && query.trim().length >= 2;
  const list = showList && (
    <div
      id={listId}
      role="listbox"
      aria-label={t.label}
      className={cn(
        "space-y-0.5",
        variant === "header"
          ? // Le panneau peut déborder du champ : les intitulés produit sont longs.
            "absolute left-0 top-full z-50 mt-2 max-h-[70vh] w-[max(100%,26rem)] max-w-[calc(100vw-3rem)] overflow-y-auto rounded-xl border border-zinc-200 bg-white p-2 shadow-xl"
          : "mt-1 rounded-lg bg-zinc-50 p-1",
      )}
    >
      {hits.map((hit, i) => (
        <SearchResultRow
          key={`${hit.href}-${i}`}
          id={`${listId}-${i}`}
          hit={hit}
          lang={lang}
          compact
          active={i === active}
          onSelect={select}
          onHover={() => setActive(i)}
        />
      ))}

      {hits.length === 0 && !loading && (
        <p className="px-3 py-4 text-center text-sm text-zinc-400">
          {isShortRefQuery(query) ? t.shortRef : t.empty}
        </p>
      )}

      {hits.length > 0 && (
        <Link
          href={`/recherche?q=${encodeURIComponent(query.trim())}&lang=${lang}`}
          onClick={select}
          className="block rounded-lg px-3 py-2 text-center text-xs font-semibold text-blue-600 hover:bg-blue-50"
        >
          {t.all} →
        </Link>
      )}
    </div>
  );

  return (
    <div ref={wrapper} className={cn("relative", className)}>
      <form onSubmit={submit} role="search">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            ref={input}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder={t.placeholder}
            role="combobox"
            aria-label={t.label}
            aria-autocomplete="list"
            aria-controls={showList ? listId : undefined}
            aria-expanded={showList}
            aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
            className="w-full rounded-full border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-9 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 [&::-webkit-search-cancel-button]:hidden"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-300" />
            ) : query ? (
              <button
                type="button"
                aria-label={t.clear}
                onClick={() => {
                  setQuery("");
                  input.current?.focus();
                }}
                className="flex h-5 w-5 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </span>
        </div>
      </form>

      {list}
    </div>
  );
}
