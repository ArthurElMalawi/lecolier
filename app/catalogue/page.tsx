import { getLang } from "@/lib/i18n";

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
