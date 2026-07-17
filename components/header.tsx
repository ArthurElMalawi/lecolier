
"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams, usePathname } from "next/navigation";
import { ProductNav } from "./product-nav";

export function Header() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const lang = searchParams.get("lang") || "fr";

  const slogan = lang === 'en' ? 'Draw your path' : 'Trace ton chemin';

  // Helper to create links that preserve other params
  const createLangLink = (targetLang: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", targetLang);
    return `${pathname}?${params.toString()}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href={`/?lang=${lang}`} className="flex items-center gap-3 group">
          <div className="relative overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="L'écolier"
              width={180}
              height={60}
              className="h-14 w-auto object-contain"
              priority
            />
          </div>
          <span className="hidden md:block text-sm font-medium text-zinc-500 italic ml-2 border-l border-zinc-300 pl-3 py-1">
            {slogan}
          </span>
        </Link>
        
        <div className="flex items-center gap-4 lg:gap-6">
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href={`/?lang=${lang}`}
              className="text-sm font-semibold text-zinc-600 hover:text-blue-600 transition-colors"
            >
              {lang === 'en' ? 'Home' : 'Accueil'}
            </Link>
            <ProductNav />
            <Link
              href={`/qui-sommes-nous?lang=${lang}`}
              className="text-sm font-semibold text-zinc-600 hover:text-blue-600 transition-colors"
            >
              {lang === 'en' ? 'Who we are' : 'Qui sommes-nous'}
            </Link>
            <Link
              href={`/nous-contacter?lang=${lang}`}
              className="text-sm font-semibold text-zinc-600 hover:text-blue-600 transition-colors"
            >
              {lang === 'en' ? 'Contact us' : 'Nous contacter'}
            </Link>
          </nav>

          <div className="h-6 w-px bg-zinc-200 hidden lg:block"></div>

          {/* Menu mobile / tablette (hamburger) */}
          <ProductNav mobileOnly />

          <div className="hidden lg:flex items-center bg-zinc-100 rounded-full p-1 border border-zinc-200">
             <Link 
               href={createLangLink('fr')} 
               className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${lang === 'fr' ? 'bg-white text-blue-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
             >
               FR
             </Link>
             <Link 
               href={createLangLink('en')} 
               className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${lang === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
             >
               EN
             </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
