import type { Metadata } from "next";
import { getLang } from "@/lib/i18n";

// Page en attente de contenu : on ne la propose pas aux moteurs.
export const metadata: Metadata = { title: "Catalogue", robots: { index: false, follow: true } };

export default async function Catalogue({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const sp = await searchParams;
  const lang = getLang(sp);

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          {lang === "en" ? "Catalogue" : "Catalogue"}
        </h1>
      </div>
    </div>
  );
}
