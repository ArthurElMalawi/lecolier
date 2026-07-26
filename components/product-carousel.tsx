"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Lang } from "@/lib/i18n";
import type { CatalogueImage } from "@/lib/catalogue-images";
import { ProductImage } from "@/components/product-image";

/**
 * Carrousel de visuels d'une fiche produit.
 *
 * Occupe le même emplacement (carré) que ProductImage, dont il reprend le
 * placeholder quand aucun visuel n'est encore disponible. Navigation par
 * flèches, vignettes, clavier (←/→) et balayage tactile.
 */
export function ProductCarousel({
  images,
  alt,
  iconKey,
  lang,
}: {
  images: CatalogueImage[];
  alt: string;
  iconKey?: string;
  lang: Lang;
}) {
  const [index, setIndex] = useState(0);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  const count = images.length;
  const go = (i: number) => setIndex(((i % count) + count) % count);

  // La vignette active reste visible quand on navigue aux flèches. On fait défiler
  // la bande elle-même : scrollIntoView ferait défiler la page entière sur mobile,
  // où les vignettes sont sous la ligne de flottaison.
  useEffect(() => {
    const strip = thumbsRef.current;
    const thumb = strip?.children[index] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    strip.scrollTo({ left: thumb.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2, behavior: "smooth" });
  }, [index]);

  if (count === 0) {
    return (
      <ProductImage
        alt={alt}
        iconKey={iconKey}
        caption={lang === "en" ? "Visual coming soon" : "Visuel à venir"}
      />
    );
  }

  const current = images[index];
  const caption = current.caption ? (lang === "en" ? current.caption.en : current.caption.fr) : null;
  const label = (fr: string, en: string) => (lang === "en" ? en : fr);

  return (
    <div
      className="space-y-3 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-4"
      role="region"
      aria-roledescription={label("carrousel", "carousel")}
      aria-label={alt}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(index - 1);
        if (e.key === "ArrowRight") go(index + 1);
      }}
    >
      <div
        className="group relative aspect-square w-full touch-pan-y overflow-hidden rounded-2xl border border-black/[.04] bg-zinc-50 dark:border-white/[.04] dark:bg-zinc-900"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const delta = touchX.current === null ? 0 : e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(delta) > 40) go(index + (delta < 0 ? 1 : -1));
          touchX.current = null;
        }}
      >
        {images.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt={img.caption ? `${alt} — ${lang === "en" ? img.caption.en : img.caption.fr}` : alt}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            priority={i === 0}
            className={`object-contain p-6 transition-opacity duration-300 sm:p-8 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          />
        ))}

        {count > 1 && (
          <>
            <Arrow side="left" onClick={() => go(index - 1)} label={label("Visuel précédent", "Previous image")} />
            <Arrow side="right" onClick={() => go(index + 1)} label={label("Visuel suivant", "Next image")} />
            <span className="absolute bottom-3 right-3 rounded-full bg-white/85 px-2.5 py-1 text-xs font-medium tabular-nums text-zinc-600 backdrop-blur-sm dark:bg-zinc-950/80 dark:text-zinc-300">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      <p className="min-h-5 text-center text-xs text-zinc-500">{caption}</p>

      {count > 1 && (
        <div
          ref={thumbsRef}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent"
        >
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${label("Visuel", "Image")} ${i + 1}`}
              aria-current={i === index}
              className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-zinc-50 transition-colors dark:bg-zinc-900 sm:h-16 sm:w-16 ${
                i === index
                  ? "border-blue-500 ring-1 ring-blue-500"
                  : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-700"
              }`}
            >
              <Image src={img.src} alt="" fill sizes="64px" className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Arrow({ side, onClick, label }: { side: "left" | "right"; onClick: () => void; label: string }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      // Masquées sur mobile (on navigue au balayage et aux vignettes) ; au survol sur écran large.
      className={`absolute top-1/2 hidden -translate-y-1/2 rounded-full bg-white/85 p-2 text-zinc-700 opacity-0 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-zinc-900 focus:opacity-100 group-hover:opacity-100 dark:bg-zinc-950/80 dark:text-zinc-200 sm:block ${
        side === "left" ? "left-3" : "right-3"
      }`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
