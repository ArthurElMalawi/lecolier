
import type { CoverType, Format, Ruling, Product } from "./catalog-types";
import { Lang, getDictionary } from "./i18n";

export function coverLabel(cover: CoverType, lang: Lang = "fr"): string {
  return getDictionary(lang).enums.cover[cover];
}

export function formatLabel(format: Format, lang: Lang = "fr"): string {
  switch (format) {
    case "F17x22":
      return "17 x 22 cm";
    case "F21x29_7":
      return lang === "en" ? "21 x 29.7 cm (A4)" : "21 x 29,7 cm (A4)";
    case "F24x32":
      return "24 x 32 cm";
  }
}

export function rulingLabel(ruling: Ruling | null | undefined, lang: Lang = "fr"): string {
  if (!ruling) return getDictionary(lang).enums.ruling.NONE;
  return getDictionary(lang).enums.ruling[ruling];
}

export function familyLabel(product: Pick<Product, "grammageGsm" | "coverType">, lang: Lang = "fr"): string {
  if (product.grammageGsm === 90 && product.coverType === 'POLYPRO_PIQUE') {
    return lang === 'en' ? '90g Polypro 300 Microns Stitched' : '90g Polypro 300 Microns Piqué';
  }
  if (product.grammageGsm === 70 && product.coverType === 'POLYPRO_PIQUE') {
    return lang === 'en' ? '70g Polypro 300 Microns Stitched' : '70g Polypro 300 Microns Piqué';
  }
  if (product.grammageGsm === 58 && product.coverType === 'CARTONNE') {
    return lang === 'en' ? '58g Hard Cover Stitched' : '58g Cartonné Piqué';
  }
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
