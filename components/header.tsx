
"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams, usePathname } from "next/navigation";

export function Header() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const lang = searchParams.get("lang") || "fr";

  // Helper to create links that preserve other params
  const createLangLink = (targetLang: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", targetLang);
    return `${pathname}?${params.toString()}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur-md dark:bg-black/80 dark:border-white/[.145]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href={`/?lang=${lang}`} className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="L'écolier"
            width={180}
            height={60}
            className="h-12 w-auto"
            priority
          />
        </Link>
        <div className="flex gap-4">
          <Link 
            href={createLangLink('fr')} 
            className={`text-sm transition-colors ${lang === 'fr' ? 'font-bold text-black dark:text-white' : 'font-medium text-zinc-500 hover:text-black dark:hover:text-white'}`}
          >
            FR
          </Link>
          <span className="text-zinc-300">|</span>
          <Link 
            href={createLangLink('en')} 
            className={`text-sm transition-colors ${lang === 'en' ? 'font-bold text-black dark:text-white' : 'font-medium text-zinc-500 hover:text-black dark:hover:text-white'}`}
          >
            EN
          </Link>
        </div>
      </div>
    </header>
  );
}
