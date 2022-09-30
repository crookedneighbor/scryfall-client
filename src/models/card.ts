"use strict";

import SingularEntity from "./singular-entity";
import type List from "./list";
import type GenericScryfallResponse from "./generic-scryfall-response";
import type MagicSet from "./magic-set";
import { get } from "../lib/api-request";

import type { ImageUris, Prices, Legalities } from "../types/api/constants";
import type CardApiResponse from "../types/api/card";
import type CardFaceApiResponse from "../types/api/card-face";
import type RelatedCardApiResponse from "../types/api/related-card";

const SCRYFALL_CARD_BACK_IMAGE_URL = "http://cards.scryfall.io/back.png";

interface Card extends CardApiResponse {
  card_faces: CardFaceApiResponse[];
}

class Card extends SingularEntity {
  _tokens: RelatedCardApiResponse[];
  _hasTokens: boolean;
  _isDoublesided: boolean;

  constructor(scryfallObject: CardApiResponse) {
    super(scryfallObject);

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
      face.flavor_name = face.flavor_name || this.flavor_name;
      face.illustration_id = face.illustration_id || this.illustration_id;
      face.image_uris = face.image_uris || this.image_uris;
      face.loyalty = face.loyalty || this.loyalty;
      face.mana_cost = face.mana_cost || this.mana_cost;
      face.name = face.name || this.name;
      face.oracle_id = face.oracle_id || this.oracle_id;
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

    // some boolean fields are incositently applied
    // IE, they only are applied if the value is true
    // and omitted if the value is false
    this.booster = this.booster || false;
    this.content_warning = this.content_warning || false;

    // flavor names of cards are not on the top level if the card
    // has multiple sides, so we create a flavor name in the same
    // style as the regular card name: the two sides, separated by //
    if (this.card_faces.length > 1 && this.card_faces[0].flavor_name) {
      this.flavor_name = this.card_faces
        .map((face) => face.flavor_name)
        .join(" // ");
    }

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

  isLegal(format: keyof Legalities): boolean {
    const legality = this.legalities[format];

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
      return (
        prices.usd ||
        prices.usd_foil ||
        prices.usd_etched ||
        prices.eur ||
        prices.eur_foil ||
        prices.tix ||
        ""
      );
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

export default Card;
