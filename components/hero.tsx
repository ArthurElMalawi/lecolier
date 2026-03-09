"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface HeroProps {
  dict: {
    title: string;
    subtitle: string;
    cta: string;
    more: string;
  };
  lang: string;
}

export function Hero({ dict, lang }: HeroProps) {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const element = document.getElementById("products");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Update URL without jump
      history.pushState(null, "", `?lang=${lang}#products`);
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-blue-50 to-white pt-16 pb-12 sm:pb-24 lg:pb-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                {dict.title}
              </h1>
              <p className="max-w-[600px] text-zinc-500 md:text-xl">
                {dict.subtitle}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href={`/?lang=${lang}#products`} onClick={handleScroll}>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  {dict.cta}
                </Button>
              </Link>
              <Link href={`/qui-sommes-nous?lang=${lang}`}>
                <Button variant="outline" size="lg">
                  {dict.more}
                </Button>
              </Link>
            </div>
          </div>
          <div className="mx-auto w-full lg:order-last">
             <div className="relative w-full h-[300px] lg:h-[400px]">
                <Image
                  src="/products/cartonne_assortit.png"
                  alt="Assortiment de cahiers L'écolier"
                  fill
                  className="object-contain"
                  priority
                />
             </div>
          </div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -z-10 h-full w-full overflow-hidden opacity-30">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-400 blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 h-72 w-72 rounded-full bg-cyan-300 blur-3xl"></div>
      </div>
    </section>
  );
}
