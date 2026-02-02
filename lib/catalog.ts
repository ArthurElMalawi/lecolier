
import { CoverType, Format, Ruling, Product } from "@/generated/prisma/client";
import { Lang, getDictionary } from "./i18n";

export function coverLabel(cover: CoverType, lang: Lang = "fr"): string {
  return getDictionary(lang).enums.cover[cover];
}

export function formatLabel(format: Format, lang: Lang = "fr"): string {
  switch (format) {
    case "F17x22":
      return "17x22";
    case "F21x29_7":
      return lang === "en" ? "21x29.7" : "21x29,7";
    case "F24x32":
      return "24x32";
  }
}

export function rulingLabel(ruling: Ruling | null | undefined, lang: Lang = "fr"): string {
  if (!ruling) return getDictionary(lang).enums.ruling.NONE;
  return getDictionary(lang).enums.ruling[ruling];
}

export function familyLabel(product: Pick<Product, "grammageGsm" | "coverType">, lang: Lang = "fr"): string {
  return `${product.grammageGsm}g ${coverLabel(product.coverType, lang)}`;
}

export function familyKey(product: Pick<Product, "grammageGsm" | "coverType">): string {
  let coverSlug = "";
  switch (product.coverType) {
    case "POLYPRO_PIQUE":
      coverSlug = "polypro-pique";
      break;
    case "POLYPRO":
      coverSlug = "polypro";
      break;
    case "CARTONNE":
      coverSlug = "cartonne";
      break;
  }
  return `${product.grammageGsm}g-${coverSlug}`;
}

export function parseFamilyKey(key: string): { grammage: number; cover: CoverType } | null {
  const match = key.match(/^(\d+)g-(.*)$/);
  if (!match) return null;
  const grammage = parseInt(match[1], 10);
  const coverSlug = match[2];

  let cover: CoverType;
  switch (coverSlug) {
    case "polypro-pique":
      cover = "POLYPRO_PIQUE";
      break;
    case "polypro":
      cover = "POLYPRO";
      break;
    case "cartonne":
      cover = "CARTONNE";
      break;
    default:
      return null;
  }

  return { grammage, cover };
}
