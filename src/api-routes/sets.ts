/* Sets - https://scryfall.com/docs/api/sets */
import { get } from "Lib/api-request";

import type List from "Models/list";
import type MagicSet from "Models/magic-set";

// https://scryfall.com/docs/api/sets/all
export function getSets(): Promise<List<MagicSet>> {
  return get("/sets");
}

// https://scryfall.com/docs/api/sets/code
// https://scryfall.com/docs/api/sets/id
export function getSet(setCodeOrId: string): Promise<MagicSet> {
  return get(`/sets/${setCodeOrId}`);
}

// https://scryfall.com/docs/api/sets/tcgplayer
export function getSetByTcgId(tcgId: number): Promise<MagicSet> {
  return get(`/sets/tcgplayer/${tcgId}`);
}
