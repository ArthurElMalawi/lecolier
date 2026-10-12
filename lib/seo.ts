import type { Metadata } from "next";
import type { Lang } from "./i18n";

/**
 * Référencement : adresse canonique, alternatives de langue et partage social.
 *
 * Le français est servi sans paramètre (/c/...), l'anglais par `?lang=en`. Les liens
 * internes portent `?lang=fr`, d'où la canonique explicite : Google ne garde qu'une
 * adresse par page et relie les deux langues via hreflang.
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
  return lang === "en" ? `${path}?lang=en` : path;
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
