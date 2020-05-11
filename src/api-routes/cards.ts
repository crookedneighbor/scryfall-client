import { get, post } from "Lib/api-request";

import type { JsonMap } from "Types/json";
import type Card from "Models/card";
import type List from "Models/list";
import type Catalog from "Models/catalog";

type UniqueOption = "cards" | "art" | "prints";
type OrderOption =
  | "name"
  | "set"
  | "released"
  | "rarity"
  | "color"
  | "usd"
  | "tix"
  | "eur"
  | "cmc"
  | "power"
  | "toughness"
  | "edhrec"
  | "artist";
type DirectionOption = "auto" | "asc" | "desc";
type SearchQueryOptions = {
  unique?: UniqueOption;
  order?: OrderOption;
  dir?: DirectionOption;
  include_extras?: boolean;
  include_multilingual?: boolean;
  include_variations?: boolean;
  page?: number;
};

type AutoCompleteOptions = {
  include_extras?: boolean;
};

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
export function search(
  searchString: string,
  options: SearchQueryOptions = {}
): Promise<List<Card>> {
  const query = {
    q: searchString,
    ...(options as JsonMap),
  };

  return get("/cards/search", query);
}

// TODO /cards/named
// https://scryfall.com/docs/api/cards/named

// https://scryfall.com/docs/api/cards/autocomplete
export function autocomplete(
  searchString: string,
  options: AutoCompleteOptions = {}
): Promise<Catalog> {
  const query = {
    q: searchString,
    ...(options as JsonMap),
  };

  return get("/cards/autocomplete", query);
}

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
