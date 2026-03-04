
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatLabel, rulingLabel, coverLabel, familyKey, familyLabel } from "@/lib/catalog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { getLang, getDictionary } from "@/lib/i18n";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const dynamic = 'force-dynamic';

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

  // Get unique colors
  const colors = Array.from(new Set(siblings.map(p => p.color).filter(Boolean))) as string[];

  const productName = lang === "en" ? product.nameEn : product.nameFr;
  const familyName = familyLabel(product, lang);
  const familyLink = `/products?family=${familyKey(product)}&lang=${lang}`;
  const formatName = formatLabel(product.format, lang);

  // Map color names to CSS colors
  const getColorStyle = (colorName: string) => {
    const map: Record<string, string> = {
      'Orange': 'bg-orange-500',
      'Gris': 'bg-gray-500',
      'Jaune': 'bg-yellow-400',
      'Rose': 'bg-pink-400',
      'Violet': 'bg-purple-500',
      'Bleu': 'bg-blue-500',
      'Rouge': 'bg-red-500',
      'Vert': 'bg-green-500',
      'Noir': 'bg-black',
      'Incolore': 'bg-transparent border border-gray-300',
      'Assortit': 'bg-gradient-to-r from-blue-400 via-red-400 to-yellow-400',
    };
    return map[colorName] || 'bg-gray-200';
  };

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
            <div className="flex flex-wrap gap-3 items-center">
               {colors.length > 0 && (
                 <TooltipProvider>
                   <div className="flex gap-1">
                     {colors.map(c => (
                       <Tooltip key={c}>
                         <TooltipTrigger asChild>
                           <div 
                             className={`w-4 h-4 rounded-sm ${getColorStyle(c)} cursor-help`} 
                           />
                         </TooltipTrigger>
                         <TooltipContent side="bottom" className="bg-white text-black dark:bg-zinc-950 dark:text-white">
                          <p className="capitalize">{c}</p>
                        </TooltipContent>
                       </Tooltip>
                     ))}
                   </div>
                 </TooltipProvider>
               )}
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
                            className="inline-flex items-center justify-center min-w-[2rem] h-8 rounded bg-white text-zinc-600 text-sm border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
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
