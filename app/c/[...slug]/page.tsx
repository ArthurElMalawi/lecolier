import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Clock, ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getLang, type Lang } from "@/lib/i18n";
import { formatLabel, parseFamilyKey } from "@/lib/catalog";
import { findByPath, nodeLabel, nodeDesc, nodeHref, type NavNode } from "@/lib/navigation";
import { NavIcon, getAccent } from "@/lib/nav-icons";
import { classementSheets } from "@/lib/classement-refs";
import { RefTable } from "@/components/ref-table";
import { ProductImage } from "@/components/product-image";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/category-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCardLink } from "@/components/product-card-link";

type Params = { slug: string[] };
type Search = { [key: string]: string | string[] | undefined };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const resolved = findByPath(slug);
  if (!resolved) return { title: "L'écolier" };
  return { title: `${resolved.node.fr} — L'écolier` };
}

/* --------------------------- Listing des produits -------------------------- */

async function FamilyProducts({ family, lang }: { family: string; lang: Lang }) {
  const parsed = parseFamilyKey(family);
  if (!parsed) return null;

  const products = await prisma.product.findMany({
    where: { grammageGsm: parsed.grammage, coverType: parsed.cover },
    orderBy: { pages: "asc" },
  });

  const order = ["F17x22", "F21x29_7", "F24x32"];
  const formats = Array.from(new Set(products.map((p) => p.format))).sort((a, b) => order.indexOf(a) - order.indexOf(b));

  if (formats.length === 0) {
    return <p className="text-sm text-zinc-500">{lang === "en" ? "No product available yet." : "Aucun produit disponible pour le moment."}</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {formats.map((fmt) => {
        const target = products.find((p) => p.format === fmt);
        if (!target) return null;
        return (
          <ProductCardLink key={fmt} href={`/product/${target.slug}?lang=${lang}`} className="group block h-full">
            <Card className="h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-lg">{formatLabel(fmt, lang)}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-6 pt-2">
                <div className="relative aspect-[3/4] w-2/3">
                  <Image src={target.imageUrl} alt={target.nameFr} fill className="object-contain p-2 transition-transform duration-300 group-hover:scale-105" />
                </div>
              </CardContent>
            </Card>
          </ProductCardLink>
        );
      })}
    </div>
  );
}

/* --------------------------------- Page ----------------------------------- */

export default async function CategoryPage({ params, searchParams }: { params: Promise<Params>; searchParams: Promise<Search> }) {
  const { slug } = await params;
  const sp = await searchParams;
  const lang = getLang(sp);

  const resolved = findByPath(slug);
  if (!resolved) notFound();

  const { node, trail } = resolved;
  const root = trail[0];
  const accent = getAccent(root.slug);

  const crumbs = trail.map((n, i) => {
    const slugs = trail.slice(0, i + 1).map((t) => t.slug);
    return {
      label: nodeLabel(n, lang),
      href: i < trail.length - 1 ? nodeHref(slugs, n, lang) : undefined,
    };
  });

  const children = node.children ?? [];
  const parentSlugs = trail.map((t) => t.slug);
  const sheet = classementSheets[node.slug];
  const note = node.note ? (lang === "en" ? node.note.en : node.note.fr) : null;
  const desc = nodeDesc(node, lang);

  /* --- Fiche produit (classement : Feuillets Mobiles, Copies Doubles…) --- */
  if (children.length === 0 && sheet) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 px-6 py-10 lg:px-8">
        <Breadcrumb items={crumbs} />

        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* Colonne gauche : image (placeholder si absente) */}
          <ProductImage
            src={node.image}
            alt={nodeLabel(node, lang)}
            iconKey={node.icon}
            caption={lang === "en" ? "Visual coming soon" : "Visuel à venir"}
          />

          {/* Colonne droite : titre + sections */}
          <div className="min-w-0 space-y-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">{nodeLabel(node, lang)}</h1>
              {desc && <p className="text-sm text-zinc-500">{desc}</p>}
            </div>

            {sheet.map((s, i) => {
              const title = lang === "en" ? s.section.en : s.section.fr;
              return (
                <section key={s.section.fr || i} className="space-y-3">
                  {title && <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">{title}</h2>}
                  <RefTable data={s.table} lang={lang} />
                </section>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* --- Catégories & gammes (en-tête dégradé) --- */
  return (
    <div className="min-h-screen">
      {/* En-tête */}
      <div className={`bg-gradient-to-br ${accent.gradient}`}>
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          <div className="mb-6 [&_a]:text-white/80 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/70">
            <Breadcrumb items={crumbs} />
          </div>
          <div className="flex items-start gap-5">
            <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm sm:flex">
              <NavIcon iconKey={node.icon} className="h-8 w-8 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{nodeLabel(node, lang)}</h1>
              {note && <p className="mt-1 text-sm font-medium italic text-white/85">{note}</p>}
              {desc && <p className="mt-3 max-w-2xl text-white/90 sm:text-lg">{desc}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Corps */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {children.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {children.map((child: NavNode) => (
              <CategoryCard key={child.slug} trail={[...parentSlugs, child.slug]} node={child} lang={lang} accent={accent} />
            ))}
          </div>
        ) : node.family ? (
          <>
            <h2 className="mb-6 text-lg font-semibold text-zinc-800">{lang === "en" ? "Available formats" : "Formats disponibles"}</h2>
            <FamilyProducts family={node.family} lang={lang} />
          </>
        ) : (
          <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-zinc-50 p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-zinc-400 shadow-sm">
              <Clock className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-semibold text-zinc-800">{lang === "en" ? "Coming soon" : "Bientôt disponible"}</h2>
            <p className="mt-2 text-sm text-zinc-500">
              {lang === "en"
                ? "This range is on its way. Come back soon to discover it."
                : "Cette gamme arrive bientôt. Revenez vite pour la découvrir."}
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link href={nodeHref([root.slug], root, lang)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {nodeLabel(root, lang)}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
