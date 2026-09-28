// Types du catalogue — anciennement générés par Prisma, désormais définis à la main
// (le back a été retiré, cf. product-refs.ts / classement-refs.ts pilotés par les images).

export type CoverType = "POLYPRO_PIQUE" | "POLYPRO" | "CARTONNE";
export type Format = "F17x22" | "F21x29_7" | "F24x32";
export type Ruling = "SEYES" | "LIGNE" | "QUADRI" | "BLANC";

/**
 * Usage d'un cahier — ce qui le distingue du cahier courant (`STD`) à grammage,
 * format et réglure égaux. Chaque valeur correspond à une page du menu :
 * TP → travaux-pratiques, MAT → maternelle-petite-ecole, DESSIN →
 * dessin-musique-chant, RECHERCHE → cahiers-specialises/cahier-recherche.
 */
export type NotebookVariant = "STD" | "TP" | "MAT" | "DESSIN" | "RECHERCHE";

/** Sous-ensemble des champs produit utilisés côté catalogue. */
export type Product = {
  grammageGsm: number;
  coverType: CoverType;
};
