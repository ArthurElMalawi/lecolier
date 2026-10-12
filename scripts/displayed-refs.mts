/**
 * Affiche (JSON) les références présentées par le site, telles que l'index de
 * recherche les recense. Lu par scripts/extract-fiches.py.
 *
 *     npx jiti scripts/displayed-refs.mts
 */
import { displayedRefs } from "../lib/search-index";

console.log(JSON.stringify([...displayedRefs()].sort()));
