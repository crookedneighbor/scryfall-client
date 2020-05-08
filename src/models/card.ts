"use strict";

import SingularEntity from "Models/singular-entity";
import type List from "Models/list";
import type GenericScryfallResponse from "Models/generic-scryfall-response";
import type MagicSet from "Models/magic-set";
import { get } from "Lib/api-request";

import type { CardApiResponse } from "Types/api-response";

type Color = "W" | "U" | "B" | "R" | "G";

type RelatedCardComponent =
  | "token"
  | "meld_part"
  | "meld_result"
  | "combo_piece";

type Legality = "legal" | "not_legal" | "restricted" | "banned";

type ImageUris = {
  png: string;
  border_crop: string;
  art_crop: string;
  large: string;
  normal: string;
  small: string;
};

type Prices = {
  usd: string;
  usd_foil: string;
  eur: string;
  tix: string;
};

type Legalities = {
  standard: Legality;
  future: Legality;
  historic: Legality;
  pioneer: Legality;
  modern: Legality;
  legacy: Legality;
  pauper: Legality;
  vintage: Legality;
  penny: Legality;
  commander: Legality;
  brawl: Legality;
  duel: Legality;
  oldschool: Legality;
  // allow arbitary new additions
  [prop: string]: string;
};

type RelatedCard = {
  object: "related_card";
  id: string; // An unique ID for this card in Scryfall’s database.
  component: RelatedCardComponent; // A field explaining what role this card plays in this relationship, one of token, meld_part, meld_result, or combo_piece.
  name: string; // The name of this particular related card.
  type_line: string; // The type line of this card.
  uri: string; // A URI where you can retrieve a full object describing this card on Scryfall’s API.
};

type CardFace = {
  object: "card_face"; // A content type for this object, always card_face.
  artist?: string; // The name of the illustrator of this card face. Newly spoiled cards may not have this field yet.
  color_indicator?: Color[]; // The colors in this face’s color indicator, if any.
  colors?: Color[]; // This face’s colors, if the game defines colors for the individual face of this card.
  flavor_text?: string; // The flavor text printed on this face, if any.
  illustration_id?: string; // A unique identifier for the card face artwork that remains consistent across reprints. Newly spoiled cards may not have this field yet.
  image_uris?: ImageUris; // An object providing URIs to imagery for this face, if this is a double-sided card. If this card is not double-sided, then the image_uris property will be part of the parent object instead.
  loyalty?: string; // This face’s loyalty, if any.
  mana_cost: string; // The mana cost for this face. This value will be any empty string "" if the cost is absent. Remember that per the game rules, a missing mana cost and a mana cost of {0} are different values.
  name: string; // The name of this particular face.
  oracle_text?: string; // The Oracle text for this face, if any.
  power?: string; // This face’s power, if any. Note that some cards have powers that are not numeric, such as *.
  printed_name?: string; // The localized name printed on this face, if any.
  printed_text?: string; // The localized text printed on this face, if any.
  printed_type_line?: string; // The localized type line printed on this face, if any.
  toughness?: string; // This face’s toughness, if any.
  type_line: string; // The type line of this particular face.
  watermark?: string; // The watermark on this particulary card face, if any.
};

const SCRYFALL_CARD_BACK_IMAGE_URL =
  "https://img.scryfall.com/errors/missing.jpg";

function formatKeysForError(obj: Record<string, string>): string {
  return Object.keys(obj)
    .map(function (key) {
      return "`" + key + "`";
    })
    .join(", ");
}

export default class Card extends SingularEntity {
  _tokens: RelatedCard[];
  _hasTokens: boolean;
  _isDoublesided: boolean;

  // Properties from https://scryfall.com/docs/api/cards
  // that the class actively uses
  all_parts?: RelatedCard[]; // If this card is closely related to other cards, this property will be an array with Related Card Objects.
  artist: string; // The name of the illustrator of this card. Newly spoiled cards may not have this field yet.
  card_faces: CardFace[]; // An array of Card Face objects, if this card is multifaced.
  collector_number: string; // This card’s collector number. Note that collector numbers can contain non-numeric characters, such as letters or ★.
  color_indicator?: Color[]; // The colors in this card’s color indicator, if any. A null value for this field indicates the card does not have one.
  colors?: Color[]; // // This card’s colors, if the overall card has colors defined by the rules. Otherwise the colors will be on the card_faces objects, see below.
  flavor_text: string; // The flavor text, if any.
  illustration_id: string; // A unique identifier for the card artwork that remains consistent across reprints. Newly spoiled cards may not have this field yet.
  image_uris: ImageUris; // An object listing available imagery for this card. See the Card Imagery article for more information.
  layout: string; // A code for this card’s layout.
  legalities: Legalities; // An object describing the legality of this card across play formats. Possible legalities are legal, not_legal, restricted, and banned.
  loyalty?: string; // This loyalty if any. Note that some cards have loyalties that are not numeric, such as X.
  mana_cost: string; // The mana cost for this card. This value will be any empty string "" if the cost is absent. Remember that per the game rules, a missing mana cost and a mana cost of {0} are different values. Multi-faced cards will report this value in card faces.
  name: string; // The name of this card. If this card has multiple faces, this field will contain both names separated by ␣//␣.  nonfoil
  oracle_text?: string; // The Oracle text for this card, if any.
  power?: string; // This card’s power, if any. Note that some cards have powers that are not numeric, such as *.
  prices: Prices; // An object containing daily price information for this card, including usd, usd_foil, eur, and tix prices, as strings.
  printed_name: string; // The localized name printed on this card, if any.
  printed_text: string; // The localized text printed on this card, if any.
  printed_type_line: string; // The localized type line printed on this card, if any.
  prints_search_uri: string; // A link to where you can begin paginating all re/prints for this card on Scryfall’s API.
  rulings_uri: string; // A link to this card’s rulings list on Scryfall’s API.
  set: string; // This card’s set code.
  set_uri: string; // A link to this card’s set object on Scryfall’s API.
  toughness?: string; // This card’s toughness, if any. Note that some cards have toughnesses that are not numeric, such as *.
  type_line: string; // The type line of this card.
  watermark: string; // This card’s watermark, if any.

  constructor(scryfallObject: CardApiResponse) {
    super(scryfallObject);

    this.all_parts = scryfallObject.all_parts;
    this.artist = scryfallObject.artist;
    this.card_faces = scryfallObject.card_faces;
    this.collector_number = scryfallObject.collector_number;
    this.color_indicator = scryfallObject.color_indicator;
    this.colors = scryfallObject.colors;
    this.flavor_text = scryfallObject.flavor_text;
    this.illustration_id = scryfallObject.illustration_id;
    this.image_uris = scryfallObject.image_uris;
    this.layout = scryfallObject.layout;
    this.legalities = scryfallObject.legalities;
    this.loyalty = scryfallObject.loyalty;
    this.mana_cost = scryfallObject.mana_cost;
    this.name = scryfallObject.name;
    this.oracle_text = scryfallObject.oracle_text;
    this.power = scryfallObject.power;
    this.prices = scryfallObject.prices;
    this.printed_name = scryfallObject.printed_name;
    this.printed_text = scryfallObject.printed_text;
    this.printed_type_line = scryfallObject.printed_type_line;
    this.prints_search_uri = scryfallObject.prints_search_uri;
    this.rulings_uri = scryfallObject.rulings_uri;
    this.set = scryfallObject.set;
    this.set_uri = scryfallObject.set_uri;
    this.toughness = scryfallObject.toughness;
    this.type_line = scryfallObject.type_line;
    this.watermark = scryfallObject.watermark;

    this._tokens = (this.all_parts || []).filter(function (part) {
      return part.component === "token";
    });

    this._hasTokens = Boolean(this._tokens.length);

    this.card_faces = this.card_faces || [
      {
        object: "card_face",
      },
    ];

    this.card_faces.forEach((face) => {
      face.artist = face.artist || this.artist;
      face.color_indicator = face.color_indicator || this.color_indicator;
      face.colors = face.colors || this.colors;
      face.flavor_text = face.flavor_text || this.flavor_text;
      face.illustration_id = face.illustration_id || this.illustration_id;
      face.image_uris = face.image_uris || this.image_uris;
      face.loyalty = face.loyalty || this.loyalty;
      face.mana_cost = face.mana_cost || this.mana_cost;
      face.name = face.name || this.name;
      face.oracle_text = face.oracle_text || this.oracle_text;
      face.power = face.power || this.power;
      face.printed_name = face.printed_name || this.printed_name;
      face.printed_text = face.printed_text || this.printed_text;
      face.printed_type_line = face.printed_type_line || this.printed_type_line;
      face.toughness = face.toughness || this.toughness;
      face.type_line = face.type_line || this.type_line;
      face.watermark = face.watermark || this.watermark;

      if (
        face.oracle_text &&
        face.oracle_text.toLowerCase().indexOf("token") > -1
      ) {
        // if the tokens are missing from the all_parts attribute
        // we still want to check the oracle text, it may only
        // be missing in the particular printing and can be found
        // by looking for another printing
        this._hasTokens = true;
      }
    });

    this._isDoublesided =
      this.layout === "transform" || this.layout === "double_faced_token";
  }

  getRulings(): Promise<List<GenericScryfallResponse>> {
    return get(this.rulings_uri);
  }

  getSet(): Promise<MagicSet> {
    return get(this.set_uri);
  }

  getPrints(): Promise<List<Card>> {
    return get(this.prints_search_uri);
  }

  isLegal(format?: string): boolean {
    if (!format) {
      throw new Error(
        "Must provide format for checking legality. Use one of " +
          formatKeysForError(this.legalities) +
          "."
      );
    }

    const legality = this.legalities[format];

    if (!legality) {
      throw new Error(
        'Format "' +
          format +
          '" is not recgonized. Use one of ' +
          formatKeysForError(this.legalities) +
          "."
      );
    }

    return legality === "legal" || legality === "restricted";
  }

  getImage(type: keyof ImageUris = "normal"): string {
    const imageObject = this.card_faces[0].image_uris;

    if (!imageObject) {
      throw new Error("Could not find image uris for card.");
    }

    return imageObject[type];
  }

  getBackImage(type: keyof ImageUris = "normal"): string {
    if (!this._isDoublesided) {
      return SCRYFALL_CARD_BACK_IMAGE_URL;
    }

    const imageObject = this.card_faces[1].image_uris;

    if (!imageObject) {
      throw new Error(
        "An unexpected error occured when attempting to show back side of card."
      );
    }

    return imageObject[type];
  }

  getPrice(type?: keyof Prices): string {
    const prices = this.prices;

    if (!type) {
      return prices.usd || prices.usd_foil || prices.eur || prices.tix || "";
    }

    return prices[type] || "";
  }

  getTokens(): Promise<Card[]> {
    if (!this._hasTokens) {
      return Promise.resolve([]);
    }

    return Promise.all(
      this._tokens.map((token) => {
        return get<Card>(token.uri);
      })
    ).then((tokens: Card[]) => {
      if (tokens.length > 0) {
        return tokens;
      }

      return this.getPrints().then((prints) => {
        const printWithTokens = prints.find((print: Card) => {
          return print._tokens.length > 0;
        });

        if (printWithTokens) {
          return printWithTokens.getTokens();
        }

        return [];
      });
    });
  }

  getTaggerUrl(): string {
    return (
      "https://tagger.scryfall.com/card/" +
      this.set +
      "/" +
      this.collector_number
    );
  }
}
