// https://scryfall.com/docs/api/sets
export default interface SetApiResponse {
  object: "set";
  id: string; // A unique ID for this set on Scryfall that will not change.
  code: string; // The unique three to five-letter code for this set.
  mtgo_code?: string; // The unique code for this set on MTGO, which may differ from the regular code.
  tcgplayer_id?: number; // This set’s ID on TCGplayer’s API, also known as the groupId.
  name: string; // The English name of the set.
  set_type: string; // A computer-readable classification for this set. See below.
  released_at?: string; // The date the set was released or the first card was printed in the set (in GMT-8 Pacific time).
  block_code?: string; // The block code for this set, if any.
  block?: string; // The block or group name code for this set, if any.
  parent_set_code?: string; // The set code for the parent set, if any. promo and token sets often have a parent set.
  card_count: number; // The number of cards in this set.
  digital: boolean; // True if this set was only released on Magic Online.
  foil_only: boolean; // True if this set contains only foil cards.
  scryfall_uri: string; // A link to this set’s permapage on Scryfall’s website.
  uri: string; // A link to this set object on Scryfall’s API.
  icon_svg_uri: string; // A URI to an SVG file for this set’s icon on Scryfall’s CDN. Hotlinking this image isn’t recommended, because it may change slightly over time. You should download it and use it locally for your particular user interface needs.
  search_uri: string; // A Scryfall API URI that you can request to begin paginating over the cards in this set.
}
