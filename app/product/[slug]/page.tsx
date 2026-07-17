import Image from "next/image";
import Link from "next/link";
import { formatLabel, rulingLabel, familyKey, familyLabel } from "@/lib/catalog";
import { findFamilyTrail, nodeLabel, nodeHref } from "@/lib/navigation";
import { refFor, availableFor } from "@/lib/product-refs";
import type { CoverType, Format, Ruling } from "@/lib/catalog-types";
import type { RefTableData } from "@/lib/classement-refs";
import { ProductSheet } from "@/components/product-sheet";
import { getLang, getDictionary } from "@/lib/i18n";

// Slug d'une fiche cahier : cahier-{grammage}g-{cover}-{format}[-5x5] (réglure 5×5 optionnelle).
const COVER_BY_SLUG: Record<string, CoverType> = {
  "polypro-pique": "POLYPRO_PIQUE",
  polypro: "POLYPRO",
  cartonne: "CARTONNE",
};
const FORMAT_BY_SLUG: Record<string, Format> = {
  "17x22": "F17x22",
  "21x29_7": "F21x29_7",
  "24x32": "F24x32",
};

export default async function ProductPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { slug } = await params;
  const sp = await searchParams;
  const lang = getLang(sp);
  const dict = getDictionary(lang);

  const m = slug.match(/^cahier-(\d+)g-(polypro-pique|polypro|cartonne)-(17x22|21x29_7|24x32)(-5x5)?$/);
  const coverType = m ? COVER_BY_SLUG[m[2]] : undefined;
  const format = m ? FORMAT_BY_SLUG[m[3]] : undefined;
  const grammageGsm = m ? Number(m[1]) : 0;
  const ruling: Ruling = m && m[4] ? "QUADRI" : "SEYES";
  const coverKey = coverType === "CARTONNE" ? "CARTONNE" : "PP";

  // Couleurs et nombres de pages disponibles, dérivés des références (images).
  const { colors, pages } =
    coverType && format ? availableFor({ grammageGsm, cover: coverKey, format, ruling }) : { colors: [], pages: [] };

  if (!coverType || !format || colors.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{dict.product.notFound}</p>
        <Link href={`/?lang=${lang}`} className="text-blue-500 hover:underline mt-4 inline-block">{dict.products.backToHome}</Link>
      </div>
    );
  }

  const rulingName = rulingLabel(ruling, lang);
  const productName = `${familyLabel({ grammageGsm, coverType }, lang)} ${formatLabel(format, lang)}${rulingName && rulingName !== "—" ? ` — ${rulingName}` : ""}`;
  const formatName = `${formatLabel(format, lang)}${ruling === "QUADRI" ? " 5×5" : ""}`;

  // Fil d'ariane reconstruit depuis l'arborescence (/c/...)
  const familyTrail = findFamilyTrail(familyKey({ grammageGsm, coverType })) ?? [];
  const crumbs = [
    ...familyTrail.map((n, i) => ({
      label: nodeLabel(n, lang),
      href: nodeHref(familyTrail.slice(0, i + 1).map((t) => t.slug), n, lang),
    })),
    { label: formatName },
  ];

  const tableData: RefTableData = {
    columns: pages.map((p) => ({ fr: String(p), en: String(p) })),
    rows: colors.map((color) => ({
      color,
      cells: pages.map((p) => refFor({ grammageGsm, cover: coverKey, format, ruling, color, pages: p })),
    })),
  };

  return (
    <ProductSheet
      crumbs={crumbs}
      title={productName}
      description={
        lang === "en"
          ? "Product references (SKU) by colour and page count"
          : "Références produit (SKU) par couleur et nombre de pages"
      }
      image={
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-black/[.04] bg-zinc-50 dark:border-white/[.04] dark:bg-zinc-900">
          <Image
            src={coverType === "CARTONNE" ? "/products/cartonne_assortit.png" : "/products/polypro_assortit.png"}
            alt={productName}
            fill
            className="object-contain p-12 transition-transform duration-500 hover:scale-105 dark:invert"
            priority
          />
        </div>
      }
      sections={[{ table: tableData }]}
      lang={lang}
    />
  );
}
