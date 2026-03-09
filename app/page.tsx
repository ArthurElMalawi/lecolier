
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { familyLabel, familyKey } from "@/lib/catalog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getLang, getDictionary } from "@/lib/i18n";
import { ProductCardLink } from "@/components/product-card-link";

import { Hero } from "@/components/hero";
import { ResellerSection } from "@/components/reseller-section";

export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const sp = await searchParams;
  const lang = getLang(sp);
  const dict = getDictionary(lang);

  const products = await prisma.product.findMany();

  const families = new Map<string, { count: number; label: string; imageUrl: string }>();
  for (const p of products) {
    const key = familyKey(p);
    const label = familyLabel(p, lang);
    const entry = families.get(key) || { count: 0, label, imageUrl: p.imageUrl };
    entry.count += 1;
    families.set(key, entry);
  }

  const items = Array.from(families.entries()).map(([key, info]) => ({ 
    key, 
    label: info.label, 
    count: info.count,
    imageUrl: info.imageUrl 
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Hero dict={dict.hero} lang={lang} />
      
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-8 w-full scroll-mt-24" id="products">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 capitalize">
            {dict.home.availableProducts}
          </h2>
          <div className="mt-2 h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <ProductCardLink key={f.key} href={`/products?family=${encodeURIComponent(f.key)}&lang=${lang}`} className="group block h-full">
              <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-center text-lg capitalize">{f.label}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2 flex justify-center items-center">
                  <div className="relative aspect-[3/4] w-2/3">
                    <Image 
                      src={f.imageUrl} 
                      alt={f.label} 
                      fill 
                      className="object-contain p-2 transition-transform duration-300 group-hover:scale-105" 
                    />
                  </div>
                </CardContent>
              </Card>
            </ProductCardLink>
          ))}
        </div>
      </div>
      
      <ResellerSection translations={dict.resellers} />
    </div>
  );
}
