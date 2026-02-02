
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatLabel, rulingLabel, coverLabel, familyKey, familyLabel } from "@/lib/catalog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { getLang, getDictionary } from "@/lib/i18n";

export default async function ProductPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { slug } = await params;
  const sp = await searchParams;
  const lang = getLang(sp);
  const dict = getDictionary(lang);
  
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{dict.product.notFound}</p>
        <Link href={`/?lang=${lang}`} className="text-blue-500 hover:underline mt-4 inline-block">{dict.products.backToHome}</Link>
      </div>
    );
  }

  // Fetch all products with the same grammage, cover, and format (siblings)
  const siblings = await prisma.product.findMany({
    where: {
      grammageGsm: product.grammageGsm,
      coverType: product.coverType,
      format: product.format,
    },
    orderBy: { pages: "asc" },
  });

  // Group siblings by ruling
  const rulingMap = new Map<string, number[]>();
  for (const p of siblings) {
    const rLabel = rulingLabel(p.ruling, lang);
    const pagesList = rulingMap.get(rLabel) || [];
    if (!pagesList.includes(p.pages)) {
      pagesList.push(p.pages);
    }
    rulingMap.set(rLabel, pagesList);
  }

  const productName = lang === "en" ? product.nameEn : product.nameFr;
  const familyName = familyLabel(product, lang);
  const familyLink = `/products?family=${familyKey(product)}&lang=${lang}`;
  const formatName = formatLabel(product.format, lang);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-8">
      {/* Top Bar: Breadcrumb + Lang Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Breadcrumb
          items={[
            { label: familyName, href: familyLink },
            { label: formatName },
          ]}
        />
        <div className="flex gap-2 self-end sm:self-auto">
          <Link href={`/product/${slug}?lang=fr`} className={`text-sm ${lang === 'fr' ? 'font-bold underline' : 'text-zinc-500'}`}>FR</Link>
          <Link href={`/product/${slug}?lang=en`} className={`text-sm ${lang === 'en' ? 'font-bold underline' : 'text-zinc-500'}`}>EN</Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-black/[.04] dark:border-white/[.04]">
           <Image 
             src={product.imageUrl} 
             alt={productName} 
             fill 
             className="object-contain p-12 transition-transform duration-500 hover:scale-105 dark:invert" 
             priority
           />
        </div>

        {/* Right Column: Product Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">{productName}</h1>
            <div className="flex flex-wrap gap-3">
               <Badge variant="blue" className="text-sm px-3 py-1">{product.grammageGsm}g</Badge>
               <Badge variant="green" className="capitalize text-sm px-3 py-1">{coverLabel(product.coverType, lang)}</Badge>
               <Badge variant="orange" className="text-sm px-3 py-1">{formatName}</Badge>
            </div>
          </div>

          <Card className="border-none shadow-none bg-zinc-50/50 dark:bg-zinc-900/50">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                <div>
                   <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">{dict.product.ruling}</div>
                   <div className="space-y-3">
                     {Array.from(rulingMap.keys()).map((ruling) => (
                       <div key={ruling} className="font-medium text-zinc-900 dark:text-zinc-100 h-8 flex items-center">
                         {ruling}
                       </div>
                     ))}
                   </div>
                </div>

                <div>
                   <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">{dict.product.pages}</div>
                   <div className="space-y-3">
                     {Array.from(rulingMap.values()).map((pages, idx) => (
                       <div key={idx} className="flex flex-wrap gap-2 h-8 items-center">
                         {pages.map((page) => (
                           <span 
                             key={page} 
                             className={
                               page === product.pages && Array.from(rulingMap.keys())[idx] === rulingLabel(product.ruling, lang)
                                 ? "inline-flex items-center justify-center min-w-[2rem] h-8 rounded bg-zinc-900 text-zinc-50 text-sm font-bold shadow-sm dark:bg-zinc-100 dark:text-zinc-900"
                                 : "inline-flex items-center justify-center min-w-[2rem] h-8 rounded bg-white text-zinc-600 text-sm border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                             }
                           >
                             {page}
                           </span>
                         ))}
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
