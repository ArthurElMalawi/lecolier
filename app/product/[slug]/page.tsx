
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

import { Check } from "lucide-react";

export const dynamic = 'force-dynamic';
// Test temporaire
console.log("ROUTE PRODUCT CHARGÉE");

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

  // Get unique colors
  const colors = Array.from(new Set(siblings.map(p => p.color).filter(Boolean))) as string[];
  
  // Define standard page counts for columns as requested
  const pageColumns = [32, 48, 96, 192, 288];

  const productName = `${familyLabel(product, lang)} ${formatLabel(product.format, lang)}`;
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

  const getAvailableRulings = (color: string, pages: number) => {
    const matches = siblings.filter(s => s.color === color && s.pages === pages);
    if (matches.length === 0) return [];
    
    // Return all rulings for this color/page combination
    // We filter based on the previous logic (32 -> LIGNE, others -> SEYES/QUADRI)
    // but now we return the actual ruling labels instead of boolean
    return matches
      .filter(m => {
        if (pages === 32) return m.ruling === 'LIGNE';
        return m.ruling === 'SEYES' || m.ruling === 'QUADRI';
      })
      .map(m => rulingLabel(m.ruling, lang));
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
             src={product.coverType === 'CARTONNE' ? '/products/cartonne_assortit.png' : '/products/polypro_assortit.png'} 
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
          </div>

          <Card className="border-none shadow-none bg-zinc-50/50 dark:bg-zinc-900/50">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="p-2"></th>
                      {pageColumns.map(page => (
                        <th key={page} className="p-2 font-medium text-zinc-500">
                          {page}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {colors.map(color => (
                      <tr key={color}>
                        <td className="p-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className={`w-6 h-6 rounded mx-auto ${getColorStyle(color)}`} />
                              </TooltipTrigger>
                              <TooltipContent side="right" className="bg-white text-black dark:bg-zinc-950 dark:text-white">
                                <p className="capitalize">{color}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                        {pageColumns.map(page => {
                          const rulings = getAvailableRulings(color, page);
                          const isAvailable = rulings.length > 0;
                          return (
                            <td key={page} className="p-1">
                              <div className={`
                                min-h-[2rem] px-1 rounded flex items-center justify-center border transition-colors text-[10px] font-medium leading-none text-center py-1
                                ${isAvailable 
                                  ? 'bg-green-100 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300' 
                                  : 'bg-zinc-50 border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-700'}
                              `}>
                                {rulings.join(", ")}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
