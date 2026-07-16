import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Lang } from "@/lib/i18n";
import { navTree, nodeLabel, nodeDesc, nodeHref } from "@/lib/navigation";
import { NavIcon, getAccent } from "@/lib/nav-icons";

/** Sections de présentation des rubriques sur la page d'accueil. */
export function CategoryShowcase({ lang }: { lang: Lang }) {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-16 px-6 py-16 lg:px-8 lg:py-24">
      {navTree.map((cat, i) => {
        const accent = getAccent(cat.slug);
        const reversed = i % 2 === 1;
        const subs = (cat.children ?? []).slice(0, 5);

        return (
          <section key={cat.slug} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
            {/* Visuel */}
            <div className={reversed ? "lg:order-2" : ""}>
              <div className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br ${accent.gradient} shadow-lg`}>
                <NavIcon iconKey={cat.icon} className="h-24 w-24 text-white/90 drop-shadow" strokeWidth={1.5} />
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15" />
                <div className="absolute -bottom-12 -left-8 h-48 w-48 rounded-full bg-black/10" />
                <span className="absolute bottom-5 left-5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  {(cat.children?.length ?? 0)} {lang === "en" ? "categories" : "catégories"}
                </span>
              </div>
            </div>

            {/* Texte */}
            <div className={reversed ? "lg:order-1" : ""}>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">{nodeLabel(cat, lang)}</h2>
              {cat.note && (
                <p className={`mt-1 text-sm font-medium italic ${accent.text}`}>{lang === "en" ? cat.note.en : cat.note.fr}</p>
              )}
              <p className="mt-4 max-w-xl text-zinc-500 sm:text-lg">{nodeDesc(cat, lang)}</p>

              {subs.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {subs.map((sub) => (
                    <li key={sub.slug} className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600">
                      {nodeLabel(sub, lang)}
                    </li>
                  ))}
                </ul>
              )}

              <Button asChild size="lg" className="mt-7 bg-blue-600 text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-blue-700">
                <Link href={nodeHref([cat.slug], cat, lang)}>
                  {lang === "en" ? "Discover" : "Découvrir"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>
        );
      })}
    </div>
  );
}
