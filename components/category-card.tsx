import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import { nodeLabel, nodeDesc, nodeHref, type NavNode } from "@/lib/navigation";
import { NavIcon, type Accent } from "@/lib/nav-icons";

/** Carte cliquable vers une (sous-)catégorie ou une famille produit. */
export function CategoryCard({ trail, node, lang, accent }: { trail: string[]; node: NavNode; lang: Lang; accent: Accent }) {
  const label = nodeLabel(node, lang);
  const desc = nodeDesc(node, lang);
  const childCount = node.children?.length ?? 0;

  const footer = node.soon
    ? lang === "en" ? "Coming soon" : "Bientôt disponible"
    : childCount > 0
      ? `${childCount} ${lang === "en" ? "categories" : "catégories"}`
      : lang === "en" ? "See products" : "Voir les produits";

  return (
    <Link
      href={nodeHref(trail, node, lang)}
      className={`group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${accent.ring} ${node.soon ? "opacity-70" : ""}`}
    >
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${accent.soft}`}>
        <NavIcon iconKey={node.icon} className="h-6 w-6" strokeWidth={1.75} />
      </div>

      <h3 className="flex items-center gap-1.5 text-base font-semibold text-zinc-900">
        {label}
        {node.phare && <Sparkles className="h-4 w-4 text-amber-500" />}
      </h3>
      {desc && <p className="mt-1.5 line-clamp-2 text-sm text-zinc-500">{desc}</p>}

      <div className="mt-auto flex items-center justify-between pt-5">
        <span className={`text-xs font-medium ${node.soon ? "text-zinc-400" : accent.text}`}>{footer}</span>
        <ArrowRight className={`h-4 w-4 text-zinc-300 transition-all group-hover:translate-x-1 ${node.soon ? "" : "group-hover:text-blue-600"}`} />
      </div>
    </Link>
  );
}
