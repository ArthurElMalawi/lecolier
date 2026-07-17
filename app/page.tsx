import { getLang, getDictionary } from "@/lib/i18n";
import { Hero } from "@/components/hero";
import { CategoryShowcase } from "@/components/category-showcase";
import { ResellerSection } from "@/components/reseller-section";

export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const sp = await searchParams;
  const lang = getLang(sp);
  const dict = getDictionary(lang);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero dict={dict.hero} lang={lang} />

      <div id="products" className="scroll-mt-24">
        <div className="text-center pt-14">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
            {lang === "en" ? "Explore our ranges" : "Découvrez nos rubriques"}
          </h2>
          <div className="mt-2 h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        <CategoryShowcase lang={lang} />
      </div>

      <ResellerSection translations={dict.resellers} />
    </div>
  );
}
