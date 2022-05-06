import { Color, ImageUris, Legalities, Prices } from "./constants";
import CardFaceResponse from "./card-face";
import RelatedComponentResponse from "./related-card";

type Rarity = "common" | "uncommon" | "rare" | "mythic";

type GameKind = "paper" | "arena" | "mtgo";

type LanguageCode =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "pt"
  | "ja"
  | "ko"
  | "ru"
  | "zhs"
  | "zht"
  | "he"
  | "la"
  | "grc"
  | "ar"
  | "sa"
  | "px";

type Layout =
  | "normal" // A standard Magic card with one face
  | "split" // A split-faced card
  | "flip" // Cards that invert vertically with the flip keyword
  | "transform" // Double-sided cards that transform
  | "meld" // Cards with meld parts printed on the back
  | "leveler" // Cards with Level Up
  | "saga" // Saga-type cards
  | "adventure" // Cards with an Adventure spell part
  | "planar" // Plane and Phenomenon-type cards
  | "scheme" // Scheme-type cards
  | "vanguard" // Vanguard-type cards
  | "token" // Token cards
  | "double_faced_token" // Tokens with another token printed on the back
  | "emblem" // Emblem cards
  | "augment" // Cards with Augment
  | "host" // Host-type cards
  | "art_series" // Art Series collectable double-faced cards
  | "double_sided"; // A Magic card with two sides that are unrelated

type Finish = "foil" | "nonfoil" | "etched" | "glossy";
type Frame =
  | "1993" // The original Magic card frame, starting from Limited Edition Alpha.
  | "1997" // The updated classic frame starting from Mirage block
  | "2003" // The “modern” Magic card frame, introduced in Eighth Edition and Mirrodin block.
  | "2015" // The holofoil-stamp Magic card frame, introduced in Magic 2015.
  | "future"; // The frame used on cards from the future

type FrameEffect =
  | "legendary" // The cards have a legendary crown
  | "miracle" // The miracle frame effect
  | "nyxtouched" // The Nyx-touched frame effect
  | "draft" // The draft-matters frame effect
  | "devoid" // The Devoid frame effect
  | "tombstone" // The Odyssey tombstone mark
  | "colorshifted" // A colorshifted frame
  | "inverted" // The FNM-style inverted frame
  | "sunmoondfc" // The sun and moon transform marks
  | "compasslanddfc" // The compass and land transform marks
  | "originpwdfc" // The Origins and planeswalker transform marks
  | "mooneldrazidfc" // The moon and Eldrazi transform marks
  | "moonreversemoondfc" // The waxing and waning crescent moon transform marks
  | "showcase" // A custom Showcase frame
  | "extendedart" // An extended art frame
  | "companion"; // The cards have a companion frame

export default interface CardApiResponse extends CardFaceResponse {
  object: "card";
  // Core Fields
  arena_id?: number; // This card’s Arena ID, if any. A large percentage of cards are not available on Arena and do not have this ID.
  id: string; // A unique ID for this card in Scryfall’s database.
  lang: LanguageCode; // A language code for this printing.
  mtgo_id?: number; // This card’s Magic Online ID (also known as the Catalog ID), if any. A large percentage of cards are not available on Magic Online and do not have this ID.
  mtgo_foil_id?: number; // This card’s foil Magic Online ID (also known as the Catalog ID), if any. A large percentage of cards are not available on Magic Online and do not have this ID.
  multiverse_ids?: string; //g[] This card’s multiverse IDs on Gatherer, if any, as an array of integers. Note that Scryfall includes many promo cards, tokens, and other esoteric objects that do not have these identifiers.
  tcgplayer_id?: number; // This card’s ID on TCGplayer’s API, also known as the productId.
  oracle_id?: string; // A unique ID for this card’s oracle identity. This value is consistent across reprinted card editions, and unique among different cards with the same name (tokens, Unstable variants, etc).
  prints_search_uri: string; // A link to where you can begin paginating all re/prints for this card on Scryfall’s API.
  rulings_uri: string; // A link to this card’s rulings list on Scryfall’s API.
  scryfall_uri: string; // A link to this card’s permapage on Scryfall’s website.
  uri: string; // A link to this card object on Scryfall’s API.

  // Gameplay Fields
  all_parts?: RelatedComponentResponse[]; // If this card is closely related to other cards, this property will be an array with Related Card Objects.
  card_faces?: CardFaceResponse[]; // An array of Card Face objects, if this card is multifaced.
  cmc: number; // // The card’s converted mana cost. Note that some funny cards have fractional mana costs.
  colors?: Color[]; // // This card’s colors, if the overall card has colors defined by the rules. Otherwise the colors will be on the card_faces objects, see below.
  color_identity: Color[]; // This card’s color identity.
  color_indicator?: Color[]; // The colors in this card’s color indicator, if any. A null value for this field indicates the card does not have one.
  edhrec_rank?: number; // This card’s overall rank/popularity on EDHREC. Not all cards are ranked.
  foil: boolean; // True if this printing exists in a foil version.
  hand_modifier?: string; // This card’s hand modifier, if it is Vanguard card. This value will contain a delta, such as -1.
  keywords: string[]; // An array of keywords that this card uses, such as 'Flying' and 'Cumulative upkeep'.
  layout: Layout; // A code for this card’s layout.
  legalities: Legalities; // An object describing the legality of this card across play formats. Possible legalities are legal, not_legal, restricted, and banned.
  life_modifier?: string; // This card’s life modifier, if it is Vanguard card. This value will contain a delta, such as +2.
  loyalty?: string; // This loyalty if any. Note that some cards have loyalties that are not numeric, such as X.
  mana_cost: string; // The mana cost for this card. This value will be any empty string "" if the cost is absent. Remember that per the game rules, a missing mana cost and a mana cost of {0} are different values. Multi-faced cards will report this value in card faces.
  name: string; // The name of this card. If this card has multiple faces, this field will contain both names separated by ␣//␣.
  nonfoil: boolean; // True if this printing exists in a nonfoil version.
  oracle_text?: string; // The Oracle text for this card, if any.
  oversized: boolean; // True if this card is oversized.
  power?: string; // This card’s power, if any. Note that some cards have powers that are not numeric, such as *.
  reserved: boolean; // True if this card is on the Reserved List.
  toughness?: string; // This card’s toughness, if any. Note that some cards have toughnesses that are not numeric, such as *.
  type_line: string; // The type line of this card.

  // Print Fields
  artist?: string; // The name of the illustrator of this card. Newly spoiled cards may not have this field yet.
  booster?: boolean; // Whether this card is found in boosters.
  border_color: "black" | "borderless" | "gold" | "silver" | "white"; // This card’s border color: black, borderless, gold, silver, or white.
  content_warning?: boolean; // True if you should consider avoiding use of this print downstream.
  card_back_id: string; // The Scryfall ID for the card back design present on this card.
  collector_number: string; // This card’s collector number. Note that collector numbers can contain non-numeric characters, such as letters or ★.
  digital: boolean; // True if this is a digital card on Magic Online.
  finishes: Finish[]; // An array of computer-readable flags that indicate if this card can come in foil, nonfoil, etched, or glossy finishes.
  flavor_name?: string; // The just-for-fun name printed on the card (such as for Godzilla series cards).
  flavor_text?: string; // The flavor text, if any.
  frame_effects?: FrameEffect[]; // This card’s frame effects, if any.
  frame: Frame; // This card’s frame layout.
  full_art: boolean; // True if this card’s artwork is larger than normal.
  games: GameKind[]; // A list of games that this card print is available in, paper, arena, and/or mtgo.
  highres_image: boolean; // True if this card’s imagery is high resolution.
  illustration_id?: string; // A unique identifier for the card artwork that remains consistent across reprints. Newly spoiled cards may not have this field yet.
  image_uris?: ImageUris; // An object listing available imagery for this card. See the Card Imagery article for more information.
  prices: Prices; // An object containing daily price information for this card, including usd, usd_foil, eur, and tix prices, as strings.
  printed_name?: string; // The localized name printed on this card, if any.
  printed_text?: string; // The localized text printed on this card, if any.
  printed_type_line?: string; // The localized type line printed on this card, if any.
  promo: boolean; // True if this card is a promotional print.
  // TODO enumerate the promo types
  promo_types?: string[]; // An array of strings describing what categories of promo cards this card falls into.
  purchase_uris: {
    // An object providing URLs to this card’s listing on major marketplaces.
    tcgplayer: string;
    cardmarket: string;
    cardhoarder: string;
  };
  rarity: Rarity; // This card’s rarity. One of common, uncommon, rare, or mythic.
  related_uris: {
    // An object providing URLs to this card’s listing on other Magic: The Gathering online resources.
    gatherer: string;
    tcgplayer_decks: string;
    edhrec: string;
    mtgtop8: string;
  };
  released_at: string; // The date this card was first released.
  reprint: boolean; // True if this card is a reprint.
  scryfall_set_uri: string; // A link to this card’s set on Scryfall’s website.
  set_name: string; // This card’s full set name.
  set_search_uri: string; // A link to where you can begin paginating this card’s set on the Scryfall API.
  set_type: string; // The type of set this printing is in.
  set_uri: string; // A link to this card’s set object on Scryfall’s API.
  set: string; // This card’s set code.
  story_spotlight: boolean; // True if this card is a Story Spotlight.
  textless: boolean; // True if the card is printed without text.
  variation: boolean; // Whether this card is a variation of another printing.
  variation_of?: string; // The printing ID of the printing this card is a variation of.
  watermark?: string; // This card’s watermark, if any.
  preview?: {
    previewed_at: string; // The date this card was previewed.
    source_uri: string; // A link to the preview for this card.
    source: string; // The name of the source that previewed this card.
  };
}
