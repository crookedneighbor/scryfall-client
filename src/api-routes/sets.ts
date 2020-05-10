import { get } from "Lib/api-request";

import type MagicSet from "Models/magic-set";

/* Sets - https://scryfall.com/docs/api/sets */
// TODO /sets
// https://scryfall.com/docs/api/sets/all

// https://scryfall.com/docs/api/sets/code
export function getSet(setCode: string): Promise<MagicSet> {
  return get(`/sets/${setCode}`);
}

// TODO /sets/tcgplayer/:id
// https://scryfall.com/docs/api/sets/tcgplayer

// TODO /sets/:id
// https://scryfall.com/docs/api/sets/id
