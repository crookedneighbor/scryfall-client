"use strict";

import { get, post } from "Lib/api-request";
import {
  setTaskDelayTime,
  resetTaskDelayTime,
} from "Lib/api-request/enque-task";
import wrapScryfallResponse, {
  setTextTransform as wrapTransform,
  resetTextTransform as wrapReset,
} from "Lib/wrap-scryfall-response";
import {
  slack as slackTransformer,
  discord as discordTransformer,
} from "Lib/convert-symbols-to-emoji";

import type { TextTransformFunction } from "Types/text-transform";
import type {
  ApiResponse,
  ListApiResponse,
  CatalogApiResponse,
} from "Types/api-response";
import CardApiResponse from "Types/api/card";
import SetApiResponse from "Types/api/set";
import type { Model } from "Types/model";
import type SingularEntity from "Models/singular-entity";
import type Card from "Models/card";
import type List from "Models/list";
import type Catalog from "Models/catalog";
import type MagicSet from "Models/magic-set";

function setTextTransform(func: TextTransformFunction): void {
  wrapTransform(func);
}

function slackify(): void {
  wrapTransform(slackTransformer);
}

function discordify(): void {
  wrapTransform(discordTransformer);
}

function resetTextTransform(): void {
  wrapReset();
}

function setApiRequestDelayTime(waitTime: number): void {
  setTaskDelayTime(waitTime);
}

function resetApiRequestDelayTime(): void {
  resetTaskDelayTime();
}

function getSymbolUrl(symbol: string): string {
  const match = symbol.match(/{?(.)}?/);
  const character = match ? match[1] : symbol;

  return "https://img.scryfall.com/symbology/" + character + ".svg";
}

function wrap(body: CardApiResponse): Card;
function wrap(body: ListApiResponse): List<SingularEntity>;
function wrap(body: SetApiResponse): MagicSet;
function wrap(body: CatalogApiResponse): Catalog;
function wrap(body: ApiResponse): Model {
  return wrapScryfallResponse(body);
}

/****************************************
 API Routes
****************************************/
/* Sets - https://scryfall.com/docs/api/sets */
// TODO /sets
// https://scryfall.com/docs/api/sets/all

// https://scryfall.com/docs/api/sets/code
function getSet(setName: string): Promise<MagicSet> {
  return get(`sets/${setName}`);
}

// TODO /sets/tcgplayer/:id
// https://scryfall.com/docs/api/sets/tcgplayer

// TODO /sets/:id
// https://scryfall.com/docs/api/sets/id

/* Cards - https://scryfall.com/docs/api/cards */
// TODO /cards
// https://scryfall.com/docs/api/cards/all

// https://scryfall.com/docs/api/cards/search
// TODO support other query params
function search(query: string): Promise<List<Card>> {
  return get("cards/search", {
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

function getCollection(
  identifiers: CardCollectionIdentifier[]
): Promise<List<Card>> {
  return post("cards/collection", {
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
function getCardByScryfallId(id: string): Promise<Card> {
  return get(`cards/${id}`);
}

/* Rulings - https://scryfall.com/docs/api/rulings */
// TODO /cards/multiverse/:id/rulings
// https://scryfall.com/docs/api/rulings/multiverse

// TODO /cards/mtgo/:id/rulings
// https://scryfall.com/docs/api/rulings/mtgo

// TODO /cards/arena/:id/rulings
// https://scryfall.com/docs/api/rulings/arena

// TODO /cards/:code/:number/rulings
// https://scryfall.com/docs/api/rulings/collector

// TODO /cards/:id/rulings
// https://scryfall.com/docs/api/rulings/id

/* Card Symbols - https://scryfall.com/docs/api/card-symbols */
// TODO /symbology
// https://scryfall.com/docs/api/card-symbols/all

// TODO /symbology/parse-mana
// https://scryfall.com/docs/api/card-symbols/parse-mana

/* Catalog - https://scryfall.com/docs/api/catalogs */
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

function getCatalog(catalog: CatalogType): Promise<Catalog> {
  return get(`/catalog/${catalog}`);
}

/* Bulk Data - https://scryfall.com/docs/api/bulk-data */
// TODO /bulk-data
// https://scryfall.com/docs/api/bulk-data/all

export = {
  setApiRequestDelayTime,
  resetApiRequestDelayTime,
  setTextTransform,
  slackify,
  discordify,
  resetTextTransform,
  getSymbolUrl,
  get,
  post,
  wrap,
  getSet,
  search,
  getCollection,
  getCardByScryfallId,
  getCatalog,
};
