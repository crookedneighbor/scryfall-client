import { get, post } from "Lib/api-request";

import type Card from "Models/card";
import type List from "Models/list";

type CardCollectionIdentifier =
  | {
      id: string;
    }
  | {
      mtgo_id: number;
    }
  | {
      multiverse_id: number;
    }
  | {
      oracle_id: string;
    }
  | {
      illustration_id: string;
    }
  | {
      name: string;
    }
  | {
      name: string;
      set: string;
    }
  | {
      collector_number: string;
      set: string;
    };

/* Cards - https://scryfall.com/docs/api/cards */
// TODO /cards
// https://scryfall.com/docs/api/cards/all

// https://scryfall.com/docs/api/cards/search
// TODO support other query params
export function search(query: string): Promise<List<Card>> {
  return get("/cards/search", {
    q: query,
  });
}

// TODO /cards/named
// https://scryfall.com/docs/api/cards/named

// TODO /cards/autocomplete
// https://scryfall.com/docs/api/cards/autocomplete

// TODO /cards/random
// https://scryfall.com/docs/api/cards/random

// https://scryfall.com/docs/api/cards/collection
export function getCollection(
  identifiers: CardCollectionIdentifier[]
): Promise<List<Card>> {
  return post("/cards/collection", {
    identifiers,
  });
}

// TODO /cards/:code/:number(/:lang)
// https://scryfall.com/docs/api/cards/collector

// TODO /cards/multiverse/:id
// https://scryfall.com/docs/api/cards/multiverse

// TODO /cards/mtgo/:id
// https://scryfall.com/docs/api/cards/mtgo

// TODO /cards/arena/:id
// https://scryfall.com/docs/api/cards/arena

// TODO /cards/tcgplayer/:id
// https://scryfall.com/docs/api/cards/tcgplayer

// https://scryfall.com/docs/api/cards/id
export function getCardByScryfallId(id: string): Promise<Card> {
  return get(`/cards/${id}`);
}
