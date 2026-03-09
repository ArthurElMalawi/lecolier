
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatLabel, familyLabel, parseFamilyKey } from "@/lib/catalog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { getLang, getDictionary } from "@/lib/i18n";
import { ProductCardLink } from "@/components/product-card-link";

export default async function Products({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const sp = await searchParams;
  const lang = getLang(sp);
  const dict = getDictionary(lang);
  const rawFamily = typeof sp.family === "string" ? sp.family : "";
  const parsed = parseFamilyKey(rawFamily);

  if (!parsed) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <p className="text-sm text-zinc-600">{dict.products.invalidFamily}</p>
        <Link href={`/?lang=${lang}`} className="text-blue-500 hover:underline mt-4 inline-block">{dict.products.backToHome}</Link>
      </div>
    );
  }

  const products = await prisma.product.findMany({
    where: { grammageGsm: parsed.grammage, coverType: parsed.cover },
    orderBy: { pages: "asc" },
  });

  const formats = Array.from(new Set(products.map((p) => p.format))).sort((a, b) => {
    const order = ["F17x22", "F21x29_7", "F24x32"];
    return order.indexOf(a) - order.indexOf(b);
  });

  // Pour chaque format, on choisit le produit avec le moins de pages comme cible par défaut
  const formatTargets = Object.fromEntries(
    formats.map((fmt) => {
      const target = products.find((p) => p.format === fmt);
      return [fmt, target];
    })
  );

  const family = familyLabel(products[0] ?? { grammageGsm: parsed.grammage, coverType: parsed.cover } as any, lang);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-8">
      {/* Top Bar: Breadcrumb + Lang Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Breadcrumb
          items={[
            { label: family },
          ]}
        />
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {formats.map((fmt) => {
           const target = formatTargets[fmt];
           if (!target) return null;
           
           return (
             <ProductCardLink key={fmt} href={`/product/${target.slug}?lang=${lang}`} className="group block h-full">
               <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                 <CardHeader className="pb-2">
                   <CardTitle className="text-center text-lg">{formatLabel(fmt as any, lang)}</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 pt-2 flex justify-center items-center">
                   <div className="relative aspect-[3/4] w-2/3">
                     <Image 
                      src={target.imageUrl} 
                      alt={target.nameFr}
                      fill
                      className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                    />
                   </div>
                 </CardContent>
               </Card>
             </ProductCardLink>
           );
        })}
      </div>
    </div>
  );
}
