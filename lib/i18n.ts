
export type Lang = "fr" | "en";

export const dictionaries = {
  fr: {
    home: {
      availableProducts: "produits disponibles",
      discoverFormats: "Découvrez les formats disponibles pour cette famille.",
      seeFormats: "Voir les formats",
    },
    products: {
      invalidFamily: "Paramètre de famille invalide.",
      availableFormats: "Formats disponibles dans cette famille",
      clickToSee: "Cliquez pour voir un produit représentatif de ce format.",
      seeProduct: "Voir le produit",
      backToHome: "Retour à l'accueil",
    },
    product: {
      notFound: "Produit introuvable.",
      grammage: "Grammage",
      cover: "Couverture",
      format: "Format",
      ruling: "Réglure",
      pages: "Pages",
      pagesSuffix: "pages",
      backToProducts: "Retour aux formats",
    },
    enums: {
      cover: {
        POLYPRO_PIQUE: "polypro piqué",
        POLYPRO: "polypro",
        CARTONNE: "cartonné",
      },
      ruling: {
        SEYES: "Seyès",
        LIGNE: "Ligne",
        QUADRI: "Quadri",
        BLANC: "Blanc",
        NONE: "—",
      },
    },
  },
  en: {
    home: {
      availableProducts: "products available",
      discoverFormats: "Discover available formats for this family.",
      seeFormats: "See formats",
    },
    products: {
      invalidFamily: "Invalid family parameter.",
      availableFormats: "Formats available in this family",
      clickToSee: "Click to see a representative product for this format.",
      seeProduct: "See product",
      backToHome: "Back to home",
    },
    product: {
      notFound: "Product not found.",
      grammage: "Weight",
      cover: "Cover",
      format: "Format",
      ruling: "Ruling",
      pages: "Pages",
      pagesSuffix: "pages",
      backToProducts: "Back to formats",
    },
    enums: {
      cover: {
        POLYPRO_PIQUE: "polypro stitched",
        POLYPRO: "polypro",
        CARTONNE: "hard cover",
      },
      ruling: {
        SEYES: "Seyes",
        LIGNE: "Lined",
        QUADRI: "Squared",
        BLANC: "Plain",
        NONE: "—",
      },
    },
  },
};

export function getDictionary(lang: Lang) {
  return dictionaries[lang] || dictionaries.fr;
}

export function getLang(searchParams: { [key: string]: string | string[] | undefined }): Lang {
  const lang = typeof searchParams.lang === "string" ? searchParams.lang : "fr";
  return (lang === "en" ? "en" : "fr") as Lang;
}
