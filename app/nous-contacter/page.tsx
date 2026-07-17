import { Mail } from "lucide-react";
import { getLang, getDictionary } from "@/lib/i18n";
import { ContactForm } from "@/components/contact-form";

export default async function NousContacterPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const sp = await searchParams;
  const lang = getLang(sp);
  const dict = getDictionary(lang);
  const t = dict.contact;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-2xl px-6 py-16 lg:px-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Mail className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">{t.title}</h1>
          <p className="mx-auto mt-3 max-w-xl text-zinc-500">{t.intro}</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <ContactForm dict={t} />
        </div>
      </div>
    </div>
  );
}
