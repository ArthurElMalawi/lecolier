import type { MetadataRoute } from "next";
import { SITE_URL, localizedUrl } from "@/lib/seo";
import { indexablePaths } from "@/lib/indexable-pages";

// Pages bilingues, puis pages en français seulement.
const STATIC_PAGES = ["/", "/qui-sommes-nous", "/nous-contacter"];
const FR_ONLY_PAGES = ["/mentions-legales", "/confidentialite"];

export default function sitemap(): MetadataRoute.Sitemap {
  const bilingual = [...STATIC_PAGES, ...indexablePaths()].map((path) => ({
    url: `${SITE_URL}${path}`,
    alternates: {
      languages: { fr: `${SITE_URL}${path}`, en: `${SITE_URL}${localizedUrl(path, "en")}` },
    },
    priority: path === "/" ? 1 : path.startsWith("/product/") ? 0.8 : 0.6,
  }));
  return [...bilingual, ...FR_ONLY_PAGES.map((path) => ({ url: `${SITE_URL}${path}`, priority: 0.1 }))];
}
