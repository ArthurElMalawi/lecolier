import { ShieldCheck, Lightbulb, Handshake } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLang, getDictionary } from "@/lib/i18n";

export default async function QuiSommesNousPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const sp = await searchParams;
  const lang = getLang(sp);
  const dict = getDictionary(lang);
  const t = dict.about;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* 1. L’Accroche */}
      <section className="bg-blue-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-6">{t.title}</h1>
        <p className="text-xl max-w-3xl mx-auto italic font-medium leading-relaxed">
          {t.catchphrase}
        </p>
      </section>

      {/* 2. Notre Histoire */}
      <section className="py-16 px-6 max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-blue-900">{t.storyTitle}</h2>
        <div className="prose lg:prose-xl text-slate-700 space-y-6 leading-relaxed">
          <p>
            {t.storyP1}
          </p>
          <p>
            <span className="font-bold text-blue-700">{t.storyP2Part1}</span> <span className="font-semibold italic">{t.storyP2Part2}</span> {t.storyP2Part3}
          </p>
          <p>
            {t.storyP3}
          </p>
        </div>
      </section>

      {/* 3. Qui sommes-nous ? */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-blue-900">{t.whoTitle}</h2>
          <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
            <p>
              <span className="font-bold text-blue-700">L&apos;écolier</span> {t.whoIntro.replace("L'écolier ", "")}
            </p>
            <ul className="space-y-4 pl-4 border-l-4 border-blue-200 ml-2">
              <li className="pl-4">
                <strong className="text-blue-800">{t.whoP1Title}</strong> {t.whoP1Text}
              </li>
              <li className="pl-4">
                <strong className="text-blue-800">{t.whoP2Title}</strong> {t.whoP2Text}
              </li>
              <li className="pl-4">
                <strong className="text-blue-800">{t.whoP3Title}</strong> {t.whoP3Text}
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Nos Valeurs */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center text-blue-900">{t.valuesTitle}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white hover:shadow-lg transition-shadow border-blue-100">
            <CardHeader className="flex flex-col items-center text-center pb-2">
              <div className="p-3 bg-blue-50 rounded-full mb-4">
                <ShieldCheck className="w-10 h-10 text-blue-600" />
              </div>
              <CardTitle className="text-xl text-blue-900">{t.val1Title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-slate-600">
              <p>{t.val1Text}</p>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-lg transition-shadow border-yellow-100">
            <CardHeader className="flex flex-col items-center text-center pb-2">
              <div className="p-3 bg-yellow-50 rounded-full mb-4">
                <Lightbulb className="w-10 h-10 text-yellow-500" />
              </div>
              <CardTitle className="text-xl text-blue-900">{t.val2Title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-slate-600">
              <p>{t.val2Text}</p>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-lg transition-shadow border-green-100">
            <CardHeader className="flex flex-col items-center text-center pb-2">
              <div className="p-3 bg-green-50 rounded-full mb-4">
                <Handshake className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-xl text-blue-900">{t.val3Title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-slate-600">
              <p>{t.val3Text}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 5. Le Mot du Fondateur */}
      <section className="py-20 px-6 bg-blue-50 text-center">
        <div className="max-w-3xl mx-auto relative">
          <div className="absolute top-0 left-0 text-6xl text-blue-200 font-serif opacity-50 transform -translate-x-8 -translate-y-8">&ldquo;</div>
          <h2 className="text-sm font-bold mb-6 text-blue-900 uppercase tracking-wide">{t.founderTitle}</h2>
          <blockquote className="text-xl italic text-slate-700 font-medium leading-relaxed relative z-10">
            {t.founderText}
          </blockquote>
        </div>
      </section>
    </div>
  );
}
