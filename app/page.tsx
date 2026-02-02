
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { familyLabel, familyKey } from "@/lib/catalog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getLang, getDictionary } from "@/lib/i18n";

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
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-8">
      <div className="flex justify-end mb-6 gap-2">
        <Link href="?lang=fr" className={`text-sm ${lang === 'fr' ? 'font-bold underline' : 'text-zinc-500'}`}>FR</Link>
        <Link href="?lang=en" className={`text-sm ${lang === 'en' ? 'font-bold underline' : 'text-zinc-500'}`}>EN</Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f) => (
          <Link key={f.key} href={`/products?family=${encodeURIComponent(f.key)}&lang=${lang}`} className="group block h-full">
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
                    className="object-contain p-2 dark:invert transition-transform duration-300 group-hover:scale-105" 
                  />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
