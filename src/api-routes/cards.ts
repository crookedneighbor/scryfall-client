/* Cards - https://scryfall.com/docs/api/cards */
import { get, post } from "../lib/api-request";

import type { JsonMap } from "../types/json";
import type Card from "../models/card";
import type List from "../models/list";
import type Catalog from "../models/catalog";

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

type NamedOptions = {
  kind?: string;
  set?: string;
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

// https://scryfall.com/docs/api/cards/named
export function getCardNamed(
  name: string,
  options: NamedOptions = {}
): Promise<Card> {
  const kind = options.kind || "fuzzy";
  const query = {
    [kind]: name,
  };

  if (options.set) {
    query.set = options.set;
  }

  return get("/cards/named", query);
}

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

// https://scryfall.com/docs/api/cards/random
export function random(searchString?: string): Promise<List<Card>> {
  if (!searchString) {
    return get("/cards/random");
  }

  return get("/cards/random", {
    q: searchString,
  });
}

// https://scryfall.com/docs/api/cards/collection
export function getCollection(
  identifiers: CardCollectionIdentifier[]
): Promise<List<Card>> {
  return post("/cards/collection", {
    identifiers,
  });
}

// https://scryfall.com/docs/api/cards/collector
export function getCardBySetCodeAndCollectorNumber(
  code: string,
  collectorNumber: string,
  lang?: string
): Promise<Card> {
  let url = `/cards/${code}/${collectorNumber}`;

  if (lang) {
    url += `/${lang}`;
  }

  return get(url);
}

// https://scryfall.com/docs/api/cards/multiverse
function getCardByMultiverseId(id: number | string): Promise<Card> {
  return get(`/cards/multiverse/${id}`);
}

// https://scryfall.com/docs/api/cards/mtgo
function getCardByMtgoId(id: number | string): Promise<Card> {
  return get(`/cards/mtgo/${id}`);
}

// https://scryfall.com/docs/api/cards/arena
function getCardByArenaId(id: number | string): Promise<Card> {
  return get(`/cards/arena/${id}`);
}

// https://scryfall.com/docs/api/cards/tcgplayer
function getCardByTcgPlayerId(id: string): Promise<Card> {
  return get(`/cards/tcgplayer/${id}`);
}

// https://scryfall.com/docs/api/cards/id
function getCardByScryfallId(id: string): Promise<Card> {
  return get(`/cards/${id}`);
}

type GetCardKind =
  | "id"
  | "scryfall"
  | "multiverse"
  | "arena"
  | "mtgo"
  | "tcg"
  | "name"
  | "exactName"
  | "fuzzyName";

export function getCard(
  idOrName: string | number,
  kind: GetCardKind = "scryfall"
): Promise<Card> {
  const value = String(idOrName);

  switch (kind) {
    case "multiverse":
      return getCardByMultiverseId(value);
    case "arena":
      return getCardByArenaId(value);
    case "mtgo":
      return getCardByMtgoId(value);
    case "tcg":
      return getCardByTcgPlayerId(value);
    case "exactName":
      return getCardNamed(value, { kind: "exact" });
    case "name":
    case "fuzzyName":
      return getCardNamed(value, { kind: "fuzzy" });
    case "id":
    case "scryfall":
    default:
      return getCardByScryfallId(value);
  }
}
