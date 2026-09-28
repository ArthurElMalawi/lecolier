import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Clock, ArrowLeft } from "lucide-react";

import { getLang, type Lang } from "@/lib/i18n";
import { formatLabel, parseFamilyKey } from "@/lib/catalog";
import type { Format } from "@/lib/catalog-types";
import { availableFor } from "@/lib/product-refs";
import { findByPath, nodeLabel, nodeDesc, nodeHref, type NavNode } from "@/lib/navigation";
import { NavIcon, getAccent } from "@/lib/nav-icons";
import { sheetFor, groupedPages } from "@/lib/usage-sheets";
import { linesFor } from "@/lib/product-lines";
import { imagesFor, imagesForPages, heroFor } from "@/lib/catalogue-images";
import { ProductCarousel } from "@/components/product-carousel";
import { ProductSheet } from "@/components/product-sheet";
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

const FORMAT_SLUG: Record<string, string> = { F17x22: "17x22", F21x29_7: "21x29_7", F24x32: "24x32" };

function FamilyProducts({ family, navPath, lang }: { family: string; navPath: string; lang: Lang }) {
  const parsed = parseFamilyKey(family);
  if (!parsed) return null;

  const coverKey = parsed.cover === "CARTONNE" ? "CARTONNE" : "PP";
  const has = (format: string, ruling?: string) =>
    availableFor({ grammageGsm: parsed.grammage, cover: coverKey, format, ruling }).pages.length > 0;

  // Une carte par format Seyès disponible, puis une carte 5×5 (réglure QUADRI) par format
  // qui en propose une — l'export en a ajouté une en A4, elle ne se limite plus au 24×32.
  // La vignette est le premier visuel du format quand il existe (voir lib/catalogue-images).
  const cards: { key: string; href: string; title: string; photo?: string }[] = [];
  const FORMATS = ["F17x22", "F21x29_7", "F24x32"] as Format[];

  for (const fmt of FORMATS) {
    if (has(fmt))
      cards.push({
        key: fmt,
        href: `/product/cahier-${family}-${FORMAT_SLUG[fmt]}?lang=${lang}`,
        title: formatLabel(fmt, lang),
        photo: heroFor(navPath, FORMAT_SLUG[fmt])?.src,
      });
  }
  for (const fmt of FORMATS) {
    if (has(fmt, "QUADRI"))
      cards.push({
        key: `${FORMAT_SLUG[fmt]}-5x5`,
        href: `/product/cahier-${family}-${FORMAT_SLUG[fmt]}-5x5?lang=${lang}`,
        title: `${formatLabel(fmt, lang)} 5×5`,
        photo: heroFor(navPath, `${FORMAT_SLUG[fmt]}-5x5`)?.src,
      });
  }

  if (cards.length === 0) {
    return <p className="text-sm text-zinc-500">{lang === "en" ? "No product available yet." : "Aucun produit disponible pour le moment."}</p>;
  }

  const img = parsed.cover === "CARTONNE" ? "/products/cartonne_assortit.png" : "/products/polypro_assortit.png";

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <ProductCardLink key={c.key} href={c.href} className="group block h-full">
          <Card className="h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-lg">{c.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-6 pt-2">
              <div className="relative aspect-[3/4] w-2/3">
                <Image
                  src={c.photo ?? img}
                  alt={c.title}
                  fill
                  sizes="(min-width: 1024px) 20vw, 40vw"
                  className={`object-contain p-2 transition-transform duration-300 group-hover:scale-105 ${c.photo ? "" : "dark:invert"}`}
                />
              </div>
            </CardContent>
          </Card>
        </ProductCardLink>
      ))}
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
  const path = slug.join("/");
  const sheet = sheetFor(path, node.slug);
  const note = node.note ? (lang === "en" ? node.note.en : node.note.fr) : null;
  const desc = nodeDesc(node, lang);
  const L = (b: { fr: string; en: string }) => (lang === "en" ? b.en : b.fr);

  /* --- Page à plusieurs produits (fournitures, accessoires) : un carrousel chacun --- */
  const lines = linesFor(path);
  if (children.length === 0 && lines.length > 0) {
    return (
      <ProductSheet
        crumbs={crumbs}
        title={nodeLabel(node, lang)}
        description={desc}
        products={lines.map((line) => ({
          key: line.variant,
          image: (
            <ProductCarousel
              images={imagesFor(path, line.variant)}
              alt={L(line.name)}
              iconKey={node.icon}
              lang={lang}
            />
          ),
          title: L(line.name),
          description: line.desc ? L(line.desc) : null,
          table: line.table,
        }))}
        lang={lang}
      />
    );
  }

  /* --- Fiche produit (classement : Feuillets Mobiles, Copies Doubles…) --- */
  // Une fiche existante l'emporte, même si le nœud porte une famille (Gamme Plume
  // présente tous ses formats dans un seul tableau). Sinon une page illustrée vaut
  // mieux qu'un « Bientôt disponible » — mais une page de gamme garde ses formats.
  const sheetImages = imagesForPages([path, ...groupedPages(path)]);
  if (children.length === 0 && (sheet || (!node.family && sheetImages.length > 0))) {
    return (
      <ProductSheet
        crumbs={crumbs}
        title={nodeLabel(node, lang)}
        description={desc}
        image={
          <ProductCarousel images={sheetImages} alt={nodeLabel(node, lang)} iconKey={node.icon} lang={lang} />
        }
        sections={(sheet ?? []).map((s) => ({
          title: lang === "en" ? s.section.en : s.section.fr,
          table: s.table,
        }))}
        note={lang === "en" ? "References coming soon." : "Références bientôt disponibles."}
        lang={lang}
      />
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
          // Page de gamme : pas de carrousel, on liste les formats (les visuels sont sur les fiches).
          <>
            <h2 className="mb-6 text-lg font-semibold text-zinc-800">{lang === "en" ? "Available formats" : "Formats disponibles"}</h2>
            <FamilyProducts family={node.family} navPath={parentSlugs.join("/")} lang={lang} />
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
