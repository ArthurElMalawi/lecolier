import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/i18n";
import type { SearchHit } from "@/lib/search-index";
import { NavIcon } from "@/lib/nav-icons";

/** Vignette d'un résultat : le visuel produit, à défaut l'icône de sa rubrique. */
function Thumb({ hit, size }: { hit: SearchHit; size: number }) {
  const box = { width: size, height: size };
  if (hit.thumb) {
    return (
      <span className="relative shrink-0 overflow-hidden rounded-md bg-white" style={box}>
        <Image src={hit.thumb} alt="" fill sizes={`${size}px`} className="object-contain" />
      </span>
    );
  }
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-400"
      style={box}
    >
      <NavIcon iconKey={hit.icon} className="h-1/2 w-1/2" />
    </span>
  );
}

/**
 * Ligne de résultat de recherche, partagée par les suggestions de la barre
 * (composant client) et la page /recherche (rendu serveur) — les deux doivent
 * présenter un résultat de la même façon.
 */
export function SearchResultRow({
  hit,
  lang,
  id,
  active = false,
  compact = false,
  onSelect,
  onHover,
}: {
  hit: SearchHit;
  lang: Lang;
  /** Cible d'`aria-activedescendant` quand la ligne est une suggestion. */
  id?: string;
  active?: boolean;
  /** Suggestions de la barre : plus dense, sans compte de références. */
  compact?: boolean;
  onSelect?: () => void;
  onHover?: () => void;
}) {
  const plural = hit.refCount > 1 ? "s" : "";
  const refs = lang === "en" ? `reference${plural}` : `référence${plural}`;

  return (
    <Link
      href={`${hit.href}?lang=${lang}`}
      id={id}
      role={compact ? "option" : undefined}
      aria-selected={compact ? active : undefined}
      onClick={onSelect}
      onMouseEnter={onHover}
      className={cn(
        "flex items-center gap-3 rounded-lg transition-colors",
        compact ? "px-3 py-2.5" : "border border-zinc-200 bg-white p-4 hover:border-blue-200 hover:shadow-sm sm:gap-4",
        active ? "bg-blue-50" : compact && "hover:bg-zinc-50",
      )}
    >
      <Thumb hit={hit} size={compact ? 40 : 56} />

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className={cn("truncate font-semibold text-zinc-800", compact ? "text-sm" : "text-base")}>
            {hit.title}
          </span>
          {hit.soon && (
            <span className="shrink-0 rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
              {lang === "en" ? "Soon" : "Bientôt"}
            </span>
          )}
        </span>

        {hit.context && <span className="block truncate text-xs text-zinc-400">{hit.context}</span>}

        {hit.matched.length > 0 && (
          <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {hit.matched.map((m) => (
              <span
                key={m.ref}
                className="rounded border border-green-200 bg-green-50 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-green-800"
              >
                {m.ref}
                {m.detail && <span className="ml-1 font-normal text-green-700">{m.detail}</span>}
              </span>
            ))}
          </span>
        )}

        {!compact && hit.matched.length === 0 && hit.refCount > 0 && (
          <span className="mt-1.5 block text-xs text-zinc-400">
            {hit.refCount} {refs}
          </span>
        )}
      </span>
    </Link>
  );
}
