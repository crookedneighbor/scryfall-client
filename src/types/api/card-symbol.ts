// https://scryfall.com/docs/api/card-symbols
import { Color } from "./constants";

export default interface RawCardSymoblResponse {
  object: "card_symbol";
  symbol: string; // The plaintext symbol. Often surrounded with curly braces {}. Note that not all symbols are ASCII text (for example, {∞}).
  svg_uri: string; // The uri where the svg for the mana symbol can be found
  loose_variant?: string; // An alternate version of this symbol, if it is possible to write it without curly braces.
  english: string; // An English snippet that describes this symbol. Appropriate for use in alt text or other accessible communication formats.
  transposable: boolean; // True if it is possible to write this symbol “backwards”. For example, the official symbol {U/P} is sometimes written as {P/U} or {P\U} in informal settings. Note that the Scryfall API never writes symbols backwards in other responses. This field is provided for informational purposes.
  represents_mana: boolean; // True if this is a mana symbol.
  cmc?: number; // A decimal number representing this symbol’s converted mana cost. Note that mana symbols from funny sets can have fractional converted mana costs.
  appears_in_mana_costs: boolean; // True if this symbol appears in a mana cost on any Magic card. For example {20} has this field set to false because {20} only appears in Oracle text, not mana costs.
  funny: boolean; // True if this symbol is only used on funny cards or Un-cards.
  colors: Color[]; // An array of colors that this symbol represents.
  gatherer_alternates?: string; // An array of plaintext versions of this symbol that Gatherer uses on old cards to describe original printed text. For example: {W} has ["oW", "ooW"] as alternates.
}
