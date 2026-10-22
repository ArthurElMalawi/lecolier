import type { Metadata } from "next";
import { withLang, type Lang } from "./i18n";

/**
 * Référencement : adresse canonique, alternatives de langue et partage social.
 *
 * Le français est servi sans paramètre (/c/...), l'anglais par `?lang=en`, liens
 * internes compris (voir `withLang`). La canonique reste explicite : une adresse
 * avec `?lang=fr` (anciens liens) renvoie à la version sans paramètre.
 */
export const SITE_URL = "https://www.lecolier.eu";
export const SITE_NAME = "L'écolier";

export const DEFAULT_DESCRIPTION: Record<Lang, string> = {
  fr: "Cahiers scolaires L'écolier : gammes polypro et cartonnées, papier 56 à 90 g/m², réglure Seyès et 5×5, classement et fournitures pour la rentrée.",
  en: "L'écolier school notebooks: polypro and hardcover ranges, 56 to 90 gsm paper, Seyès and 5×5 ruling, filing and school supplies.",
};

const DEFAULT_IMAGE = "/products/image_hero.jpg";

/** URL d'une page dans une langue (chemin sans paramètre de langue). */
export function localizedUrl(path: string, lang: Lang): string {
  return withLang(path, lang);
}

export function pageMetadata(opts: {
  path: string;
  lang: Lang;
  title?: string;
  description?: string | null;
  image?: string;
  noindex?: boolean;
  /** Page rédigée en français seulement : pas d'alternative anglaise à annoncer. */
  frOnly?: boolean;
}): Metadata {
  const { path, lang } = opts;
  const description = opts.description || DEFAULT_DESCRIPTION[lang];
  const url = localizedUrl(path, lang);
  return {
    ...(opts.title ? { title: opts.title } : {}),
    description,
    alternates: {
      canonical: url,
      ...(opts.frOnly ? {} : { languages: { fr: path, en: localizedUrl(path, "en"), "x-default": path } }),
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: lang === "en" ? "en_GB" : "fr_FR",
      url,
      title: opts.title ? `${opts.title} — ${SITE_NAME}` : SITE_NAME,
      description,
      images: [opts.image ?? DEFAULT_IMAGE],
    },
    ...(opts.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/**
 * URL absolue canonique d'un lien interne : un éventuel `?lang=fr` est retiré,
 * comme pour la balise canonique.
 */
export function absoluteUrl(href: string): string {
  const url = new URL(href, SITE_URL);
  if (url.searchParams.get("lang") === "fr") url.searchParams.delete("lang");
  return url.toString();
}

/**
 * Variantes sous lesquelles la marque est tapée (sans accent, sans apostrophe…) :
 * annoncées dans les données structurées pour que « lecolier » renvoie au site.
 */
export const SITE_ALTERNATE_NAMES = ["Lecolier", "L'ecolier", "L’écolier", "lecolier.eu", "Cahiers L'écolier"];
