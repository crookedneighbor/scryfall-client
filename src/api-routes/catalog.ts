/* Catalog - https://scryfall.com/docs/api/catalogs */
import { get } from "../lib/api-request";
import type Catalog from "../models/catalog";

// These are return the same signature, a Catalog of strings
// So we just expose one method for all the routes
type CatalogType =
  | "card-names"
  | "artist-names"
  | "word-bank"
  | "creature-types"
  | "planeswalker-types"
  | "land-types"
  | "artifact-types"
  | "enchantment-types"
  | "spell-types"
  | "powers"
  | "toughnesses"
  | "loyalties"
  | "watermarks";

export function getCatalog(catalog: CatalogType): Promise<Catalog> {
  return get(`/catalog/${catalog}`);
}
