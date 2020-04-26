"use strict";

import List from "Models/list";
import type {
  Legalities,
  Prices,
  ImageUris,
  ScryfallRelatedCard,
  ScryfallCardFace,
} from "Types/api/card";
import { ScryfallCard } from "Types/api/card";
import type { ModelConfig } from "Types/model-config";

// TODO no any
function formatKeysForError(obj: any) {
  return Object.keys(obj)
    .map(function (key) {
      return "`" + key + "`";
    })
    .join(", ");
}

const SCRYFALL_CARD_BACK_IMAGE_URL =
  "https://img.scryfall.com/errors/missing.jpg";

export default class Card extends ScryfallCard {
  _request: Function;
  _tokens: ScryfallRelatedCard[];
  _hasTokens: boolean;
  _isDoublesided: boolean;
  card_faces: ScryfallCardFace[];

  constructor(scryfallObject: ScryfallCard, config: ModelConfig) {
    super();

    Object.assign(this, scryfallObject);

    this._request = config.requestMethod;
    this._tokens = (scryfallObject.all_parts || []).filter(function (part) {
      return part.component === "token";
    });

    this._hasTokens = Boolean(this._tokens.length);

    this.card_faces = scryfallObject.card_faces || [
      {
        object: "card_face",
      },
    ];

    this.card_faces.forEach((face) => {
      face.artist = face.artist || scryfallObject.artist;
      face.color_indicator =
        face.color_indicator || scryfallObject.color_indicator;
      face.colors = face.colors || scryfallObject.colors;
      face.flavor_text = face.flavor_text || scryfallObject.flavor_text;
      face.illustration_id =
        face.illustration_id || scryfallObject.illustration_id;
      face.image_uris = face.image_uris || scryfallObject.image_uris;
      face.loyalty = face.loyalty || scryfallObject.loyalty;
      face.mana_cost = face.mana_cost || scryfallObject.mana_cost;
      face.name = face.name || scryfallObject.name;
      face.oracle_text = face.oracle_text || scryfallObject.oracle_text;
      face.power = face.power || scryfallObject.power;
      face.printed_name = face.printed_name || scryfallObject.printed_name;
      face.printed_text = face.printed_text || scryfallObject.printed_text;
      face.printed_type_line =
        face.printed_type_line || scryfallObject.printed_type_line;
      face.toughness = face.toughness || scryfallObject.toughness;
      face.type_line = face.type_line || scryfallObject.type_line;
      face.watermark = face.watermark || scryfallObject.watermark;

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
      scryfallObject.layout === "transform" ||
      scryfallObject.layout === "double_faced_token";
  }

  getRulings() {
    return this._request(this.rulings_uri as URL);
  }

  getSet() {
    return this._request(this.set_uri as URL);
  }

  getPrints(): Promise<List> {
    return this._request(this.prints_search_uri as URL);
  }

  isLegal(format?: string) {
    if (!format) {
      throw new Error(
        "Must provide format for checking legality. Use one of " +
          formatKeysForError(this.legalities) +
          "."
      );
    }

    const legality = this.legalities![format];

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

  getImage(type?: keyof ImageUris) {
    const imageObject = this.card_faces[0].image_uris;

    if (!imageObject) {
      throw new Error("Could not find image uris for card.");
    }

    type = type || "normal";

    if (!(type in imageObject)) {
      throw new Error(
        "`" +
          type +
          "` is not a valid type. Must be one of " +
          formatKeysForError(imageObject) +
          "."
      );
    }

    return imageObject[type];
  }

  getBackImage(type?: keyof ImageUris) {
    if (!this._isDoublesided) {
      return SCRYFALL_CARD_BACK_IMAGE_URL;
    }

    type = type || "normal";
    const imageObject = this.card_faces[1].image_uris;

    if (!imageObject) {
      throw new Error(
        "An unexpected error occured when attempting to show back side of card."
      );
    }

    if (!imageObject[type]) {
      throw new Error(
        "`" +
          type +
          "` is not a valid type. Must be one of " +
          formatKeysForError(imageObject) +
          "."
      );
    }

    return imageObject[type];
  }

  getPrice(type?: keyof Prices) {
    const prices = this.prices!;

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
        return this._request(token.uri as URL);
      })
    ).then((tokens) => {
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

  getTaggerUrl() {
    return (
      "https://tagger.scryfall.com/card/" +
      this.set +
      "/" +
      this.collector_number
    );
  }
}
