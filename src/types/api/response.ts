import { ScryfallCardSymbol } from "./card-symbol";
import { ScryfallCard } from "./card";
import { ScryfallCatalog } from "./catalog";
import { ScryfallRuling } from "./ruling";
import { ScryfallSet } from "./set";

export type ScryfallResponseObject =
  | ScryfallCardSymbol
  | ScryfallCard
  | ScryfallRuling
  | ScryfallSet;

export type ScryfallList = {
  object: "list";
  data: ScryfallResponseObject[]; // An array of the requested objects, in a specific order.
  has_more: boolean; // True if this List is paginated and there is a page beyond the current page.
  next_page?: URL; // If there is a page beyond the current page, this field will contain a full API URI to that page. You may submit a HTTP GET request to that URI to continue paginating forward on this List.
  total_cards?: number; // If this is a list of Card objects, this field will contain the total number of cards found across all pages.
  warnings?: string[]; // An array of human-readable warnings issued when generating this list, as strings. Warnings are non-fatal issues that the API discovered with your input. In general, they indicate that the List will not contain the all of the information you requested. You should fix the warnings and re-submit your request.
};

export type ScryfallResponse =
  | ScryfallList
  | ScryfallCatalog
  | ScryfallResponseObject;
