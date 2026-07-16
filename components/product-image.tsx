import Image from "next/image";
import { NavIcon } from "@/lib/nav-icons";

/**
 * Emplacement image d'une fiche produit.
 * Affiche l'image si `src` est fourni, sinon un placeholder (icône) — l'emplacement
 * est ainsi prévu même quand le visuel n'existe pas encore.
 */
export function ProductImage({
  src,
  alt,
  iconKey,
  caption,
}: {
  src?: string;
  alt: string;
  iconKey?: string;
  caption?: string;
}) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-black/[.04] bg-zinc-50 dark:border-white/[.04] dark:bg-zinc-900">
      {src ? (
        <Image src={src} alt={alt} fill className="object-contain p-12 transition-transform duration-500 hover:scale-105" priority />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-zinc-300 dark:text-zinc-600">
          <NavIcon iconKey={iconKey} className="h-20 w-20" strokeWidth={1.25} />
          {caption && <span className="text-xs font-medium uppercase tracking-wide">{caption}</span>}
        </div>
      )}
    </div>
  );
}
