import { NextResponse } from "next/server";

import { searchCatalogue } from "@/lib/search-index";
import type { Lang } from "@/lib/i18n";

/**
 * Suggestions de la barre de recherche.
 *
 * L'index reste côté serveur : la barre interroge cette route au fil de la
 * frappe plutôt que d'embarquer tout le catalogue dans le bundle client.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const lang: Lang = searchParams.get("lang") === "en" ? "en" : "fr";

  return NextResponse.json({ hits: searchCatalogue(q, lang, 6) });
}
