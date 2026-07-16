"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/i18n";
import { navTree, nodeLabel, nodeHref, type NavNode } from "@/lib/navigation";
import { NavIcon } from "@/lib/nav-icons";

/* -------------------------------------------------------------------------- */
/*  Feuille (lien réel ou "bientôt")                                           */
/* -------------------------------------------------------------------------- */

function Leaf({ trail, node, lang, onNavigate }: { trail: string[]; node: NavNode; lang: Lang; onNavigate?: () => void }) {
  const label = nodeLabel(node, lang);

  if (node.soon) {
    return (
      <Link
        href={nodeHref(trail, node, lang)}
        onClick={onNavigate}
        className="group/leaf flex items-center gap-2 rounded-md px-2 py-1 text-sm text-zinc-400 transition-colors hover:bg-zinc-50 hover:text-zinc-600"
      >
        <span className="h-1 w-1 shrink-0 rounded-full bg-zinc-200" />
        {label}
        <span className="ml-auto rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
          {lang === "en" ? "Soon" : "Bientôt"}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={nodeHref(trail, node, lang)}
      onClick={onNavigate}
      className="group/leaf flex items-center gap-2 rounded-md px-2 py-1 text-sm text-zinc-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
    >
      <span className="h-1 w-1 shrink-0 rounded-full bg-zinc-300 transition-colors group-hover/leaf:bg-blue-500" />
      {label}
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sous-catégorie (titre + feuilles) — Desktop mega                           */
/* -------------------------------------------------------------------------- */

function MegaSub({ trail, node, lang, onNavigate }: { trail: string[]; node: NavNode; lang: Lang; onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const label = nodeLabel(node, lang);
  const here = [...trail, node.slug];
  const hasChildren = !!node.children?.length;

  if (!hasChildren) return <Leaf trail={here} node={node} lang={lang} onNavigate={onNavigate} />;

  return (
    <div>
      <div className="flex items-center gap-1">
        <Link
          href={nodeHref(here, node, lang)}
          onClick={onNavigate}
          className="flex flex-1 items-center gap-1.5 rounded-md px-2 py-1 text-sm font-semibold text-zinc-800 transition-colors hover:text-blue-600"
        >
          {label}
          {node.phare && <Sparkles className="h-3.5 w-3.5 text-amber-500" />}
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Réduire" : "Dérouler"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180")} />
        </button>
      </div>
      <div className={cn("grid transition-all duration-200 ease-out", open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className="overflow-hidden">
          <div className="ml-2 mt-0.5 flex flex-col border-l border-zinc-100 pl-2">
            {node.children!.map((child) => (
              <Leaf key={child.slug} trail={[...here, child.slug]} node={child} lang={lang} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Méga-menu "Nos produits" — Desktop                                         */
/* -------------------------------------------------------------------------- */

function DesktopMega({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openNow = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 140);
  };
  const close = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(false);
  };

  return (
    <div className="relative flex h-20 items-center" onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-full items-center gap-1 px-2 text-sm font-semibold transition-colors",
          open ? "text-blue-600" : "text-zinc-600 hover:text-blue-600"
        )}
      >
        {lang === "en" ? "Our Products" : "Nos produits"}
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180")} />
      </button>

      <div
        className={cn(
          "fixed inset-x-0 top-20 z-40 origin-top border-b border-zinc-200 bg-white shadow-xl transition-all duration-200",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
        )}
      >
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="grid grid-cols-2 items-start gap-x-8 gap-y-8 md:grid-cols-3 lg:grid-cols-5">
            {navTree.map((cat) => (
              <div key={cat.slug} className="space-y-3">
                <Link
                  href={nodeHref([cat.slug], cat, lang)}
                  onClick={close}
                  className="block text-xs font-bold uppercase tracking-wider text-blue-600 hover:underline"
                >
                  {nodeLabel(cat, lang)}
                </Link>
                {cat.note && (
                  <p className="text-[11px] font-medium italic text-blue-400">
                    {lang === "en" ? cat.note.en : cat.note.fr}
                  </p>
                )}
                <div className="flex flex-col gap-3">
                  {cat.children?.map((child) => (
                    <MegaSub key={child.slug} trail={[cat.slug]} node={child} lang={lang} onNavigate={close} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tiroir Mobile (navigation en « pages » avec drill-down)                     */
/* -------------------------------------------------------------------------- */

/** Ligne de menu : bouton d'entrée (a des enfants) ou feuille (lien direct). */
function MobileRow({
  trailSlugs,
  node,
  lang,
  onDrill,
  close,
}: {
  trailSlugs: string[];
  node: NavNode;
  lang: Lang;
  onDrill: (node: NavNode) => void;
  close: () => void;
}) {
  const here = [...trailSlugs, node.slug];

  if (!node.children?.length) {
    return <Leaf trail={here} node={node} lang={lang} onNavigate={close} />;
  }

  return (
    <button
      type="button"
      onClick={() => onDrill(node)}
      className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-2.5 text-left text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
    >
      <span className="flex items-center gap-2">
        <NavIcon iconKey={node.icon} className="h-4 w-4 shrink-0 text-zinc-400" />
        {nodeLabel(node, lang)}
        {node.phare && <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-500" />}
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400" />
    </button>
  );
}

function MobileNav({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const [stack, setStack] = useState<NavNode[]>([]);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const openMenu = () => {
    setStack([]);
    setOpen(true);
  };
  const close = () => setOpen(false);
  const drill = (node: NavNode) => setStack((s) => [...s, node]);
  const back = () => setStack((s) => s.slice(0, -1));

  const current = stack[stack.length - 1];
  const trailSlugs = stack.map((n) => n.slug);
  const items = current ? current.children ?? [] : navTree;

  // Lien de bascule de langue conservant la page et les autres paramètres.
  const langLink = (target: Lang) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", target);
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={lang === "en" ? "Open menu" : "Ouvrir le menu"}
        onClick={openMenu}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-700 hover:bg-zinc-100"
      >
        <Menu className="h-6 w-6" />
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/40" onClick={close} />
          <div className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-white shadow-2xl">
            {/* Barre haute : retour / titre + fermeture */}
            <div className="flex items-center gap-2 border-b border-zinc-200 px-3 py-3">
              {stack.length > 0 ? (
                <button
                  type="button"
                  onClick={back}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100"
                >
                  <ChevronLeft className="h-5 w-5" />
                  {lang === "en" ? "Back" : "Retour"}
                </button>
              ) : (
                <span className="px-2 text-sm font-bold uppercase tracking-wider text-zinc-800">Menu</span>
              )}
              <button
                type="button"
                aria-label={lang === "en" ? "Close menu" : "Fermer le menu"}
                onClick={close}
                className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Liste : niveau courant */}
            <div className="flex-1 overflow-y-auto p-2">
              {current ? (
                <Link
                  href={nodeHref(trailSlugs, current, lang)}
                  onClick={close}
                  className="mb-1 block rounded-md bg-blue-50/60 px-3 py-2.5"
                >
                  <span className="block text-base font-bold text-zinc-900">{nodeLabel(current, lang)}</span>
                  <span className="text-xs font-semibold text-blue-600">{lang === "en" ? "View all →" : "Tout voir →"}</span>
                </Link>
              ) : (
                <Link
                  href={`/?lang=${lang}`}
                  onClick={close}
                  className="block rounded-md px-2 py-2.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
                >
                  {lang === "en" ? "Home" : "Accueil"}
                </Link>
              )}

              {items.map((node) => (
                <MobileRow key={node.slug} trailSlugs={trailSlugs} node={node} lang={lang} onDrill={drill} close={close} />
              ))}

              {!current && (
                <Link
                  href={`/qui-sommes-nous?lang=${lang}`}
                  onClick={close}
                  className="block rounded-md px-2 py-2.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
                >
                  {lang === "en" ? "Who we are" : "Qui sommes-nous"}
                </Link>
              )}
            </div>

            {/* Sélecteur de langue (bas de menu) */}
            <div className="flex items-center justify-center border-t border-zinc-200 px-4 py-4">
              <div className="flex items-center rounded-full border border-zinc-200 bg-zinc-100 p-1">
                {(["fr", "en"] as const).map((l) => (
                  <Link
                    key={l}
                    href={langLink(l)}
                    onClick={close}
                    className={cn(
                      "rounded-full px-5 py-1.5 text-xs font-bold uppercase transition-all",
                      lang === l ? "bg-white text-blue-600 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
                    )}
                  >
                    {l}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Export public                                                              */
/* -------------------------------------------------------------------------- */

export function ProductNav({ mobileOnly = false }: { mobileOnly?: boolean }) {
  const searchParams = useSearchParams();
  const lang: Lang = searchParams.get("lang") === "en" ? "en" : "fr";
  return mobileOnly ? <MobileNav lang={lang} /> : <DesktopMega lang={lang} />;
}
