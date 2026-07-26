/**
 * Règles de saisie de la recherche, partagées par l'index (serveur) et la barre
 * (client) — ce module reste volontairement sans dépendance pour que le client
 * n'embarque pas le catalogue avec.
 */

/** Nombre minimum de chiffres pour qu'une requête soit confrontée aux références. */
export const MIN_REF_DIGITS = 3;

/**
 * Requête purement numérique, mais trop courte pour désigner une référence.
 * « 44 » correspondrait à la moitié du catalogue : on le dit plutôt que de
 * renvoyer un « aucun résultat » trompeur.
 */
export function isShortRefQuery(query: string): boolean {
  const q = query.trim();
  return /^\d+$/.test(q) && q.length < MIN_REF_DIGITS;
}
